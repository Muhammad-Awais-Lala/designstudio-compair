// Example Backend API Implementation (Node.js/Express)
// This is a sample implementation showing how the backend might work

const express = require('express');
const multer = require('multer');
const sharp = require('sharp'); // For image processing
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// Configure CORS if frontend is on different domain
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

/**
 * API Endpoint: Apply Sheet Overlay
 * POST /api/apply-sheet
 * 
 * Request Body:
 * {
 *   baseImage: string,
 *   hotspotName: string,
 *   selectedSheet: { id, name, path }
 * }
 */
app.post('/api/apply-sheet', async (req, res) => {
    try {
        const { baseImage, hotspotName, selectedSheet } = req.body;

        console.log('📥 Received request:', {
            baseImage,
            hotspotName,
            selectedSheet
        });

        // Validate input
        if (!baseImage || !hotspotName || !selectedSheet) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'baseImage, hotspotName, and selectedSheet are required'
            });
        }

        // Get absolute paths
        const baseImagePath = path.join(__dirname, 'public', baseImage);
        const sheetPath = path.join(__dirname, 'public', selectedSheet.path);

        // Check if files exist
        if (!fs.existsSync(baseImagePath)) {
            return res.status(404).json({
                success: false,
                error: 'Base image not found',
                message: `File not found: ${baseImage}`
            });
        }

        if (!fs.existsSync(sheetPath)) {
            return res.status(404).json({
                success: false,
                error: 'Sheet image not found',
                message: `File not found: ${selectedSheet.path}`
            });
        }

        // Process the image based on hotspot
        const overlayImage = await processOverlay(
            baseImagePath,
            sheetPath,
            hotspotName
        );

        // Generate unique filename
        const timestamp = Date.now();
        const overlayFilename = `overlay_${hotspotName.toLowerCase()}_${timestamp}.png`;
        const overlayPath = path.join(__dirname, 'public', 'overlays', overlayFilename);

        // Ensure overlays directory exists
        const overlaysDir = path.join(__dirname, 'public', 'overlays');
        if (!fs.existsSync(overlaysDir)) {
            fs.mkdirSync(overlaysDir, { recursive: true });
        }

        // Save the processed overlay
        await overlayImage.toFile(overlayPath);

        // Return the URL to the overlay image
        const overlayUrl = `/overlays/${overlayFilename}`;

        console.log('✅ Overlay created:', overlayUrl);

        res.json({
            success: true,
            overlayImageUrl: overlayUrl,
            message: 'Overlay generated successfully'
        });

    } catch (error) {
        console.error('❌ Error processing overlay:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Process overlay based on hotspot location
 * This is where you implement the actual image processing logic
 */
async function processOverlay(baseImagePath, sheetPath, hotspotName) {
    // Load the base image to get dimensions
    const baseImage = sharp(baseImagePath);
    const baseMetadata = await baseImage.metadata();

    // Load the sheet image
    const sheetImage = sharp(sheetPath);
    const sheetMetadata = await sheetImage.metadata();

    // Define overlay positions and sizes based on hotspot
    // These values should be calibrated based on your actual room image
    const overlayConfig = {
        Wall: {
            // Position the sheet on the wall area
            left: Math.floor(baseMetadata.width * 0.1),
            top: Math.floor(baseMetadata.height * 0.05),
            width: Math.floor(baseMetadata.width * 0.4),
            height: Math.floor(baseMetadata.height * 0.5)
        },
        Floor: {
            // Position the sheet on the floor area
            left: Math.floor(baseMetadata.width * 0.2),
            top: Math.floor(baseMetadata.height * 0.6),
            width: Math.floor(baseMetadata.width * 0.6),
            height: Math.floor(baseMetadata.height * 0.35)
        },
        Pillars: {
            // Position the sheet on the pillars area
            left: Math.floor(baseMetadata.width * 0.65),
            top: Math.floor(baseMetadata.height * 0.3),
            width: Math.floor(baseMetadata.width * 0.25),
            height: Math.floor(baseMetadata.height * 0.6)
        }
    };

    const config = overlayConfig[hotspotName];

    if (!config) {
        throw new Error(`Unknown hotspot: ${hotspotName}`);
    }

    // Resize the sheet to fit the target area
    const resizedSheet = await sheetImage
        .resize(config.width, config.height, {
            fit: 'fill'
        })
        .toBuffer();

    // Create a transparent canvas with same dimensions as base image
    const canvas = sharp({
        create: {
            width: baseMetadata.width,
            height: baseMetadata.height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    });

    // Composite the resized sheet onto the canvas at the specified position
    const result = await canvas
        .composite([
            {
                input: resizedSheet,
                left: config.left,
                top: config.top
            }
        ])
        .png();

    return result;
}

// Serve static files (images, overlays, etc.)
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/apply-sheet`);
});

module.exports = app;
