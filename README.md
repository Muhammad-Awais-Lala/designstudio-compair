# Bedroom Customizer - Backend API Integration

## 🎯 Overview

This application has been **completely refactored** to support backend API integration for dynamic room customization. The new architecture uses a single base image with overlay rendering instead of pre-generated combination images.

## ✨ Key Changes

### Before (Frontend-only)
- ❌ 27 pre-generated combination images
- ❌ Frontend switches between images
- ❌ Limited to predefined combinations
- ❌ Large asset size

### After (Backend Integration)
- ✅ Single base image
- ✅ Dynamic overlay rendering via API
- ✅ Unlimited combinations
- ✅ Smaller asset footprint
- ✅ All sheets shown in modal (not filtered)

## 🏗️ Architecture

```
User clicks hotspot
    ↓
Modal shows ALL available sheets
    ↓
User selects a sheet
    ↓
API call with: {baseImage, hotspotName, selectedSheet}
    ↓
Backend processes and returns overlay image
    ↓
Overlay rendered on top of base image
```

## 📁 Files

- **index.html** - Main application with new API integration logic
- **styles/style.css** - Updated styles for overlay rendering
- **API_INTEGRATION_GUIDE.md** - Detailed documentation
- **backend-example.js** - Sample backend implementation

## 🚀 Current Status: DUMMY MODE

The application is currently running in **dummy mode**:
- ✅ All frontend functionality works
- ✅ Modal shows all sheets
- ✅ Overlay rendering works
- ✅ API request data is logged to console
- ⚠️ **No actual API calls are made**
- ⚠️ Uses sheet images directly as overlays (for testing)

## 📊 Console Output

When you select a sheet, check the browser console:

```
🎯 API Call (Dummy Data):
Base Image: assets/room_wall1_floor1_table1.jpg
Hotspot Name: Wall
Selected Sheet: {id: 1, name: 'Wall Sheet 1', path: 'assets/sheets/wall1.png'}
📤 Request Data: {
  "baseImage": "assets/room_wall1_floor1_table1.jpg",
  "hotspotName": "Wall",
  "selectedSheet": {...}
}
✅ Overlay applied for: Wall
```

## 🔧 How to Test

1. **Open index.html** in a browser
2. **Click on any hotspot marker** (Wall, Floor, or Pillars)
3. **Select a sheet** from the modal
4. **Check the console** to see the API request data
5. **See the overlay** rendered on the image

## 🔌 API Integration

### To Enable Real API Calls

1. **Set up your backend** (see `backend-example.js`)
2. **Update API endpoint** in `index.html`:
   ```javascript
   const API_ENDPOINT = 'https://your-backend.com/api/apply-sheet';
   ```
3. **Uncomment the fetch code** in the `applySheet()` function
4. **Remove the dummy overlay code**

### API Request Format

```json
{
  "baseImage": "assets/room_wall1_floor1_table1.jpg",
  "hotspotName": "Wall",
  "selectedSheet": {
    "id": 1,
    "name": "Wall Sheet 1",
    "path": "assets/sheets/wall1.png"
  }
}
```

### Expected API Response

```json
{
  "success": true,
  "overlayImageUrl": "https://cdn.example.com/overlays/wall_overlay_123.png",
  "message": "Overlay generated successfully"
}
```

## 📚 Documentation

See **API_INTEGRATION_GUIDE.md** for:
- Detailed architecture explanation
- Step-by-step API integration guide
- Backend API specifications
- Error handling
- Testing procedures

## 🛠️ Backend Example

The `backend-example.js` file provides a complete Node.js/Express implementation showing:
- API endpoint setup
- Image processing with Sharp library
- Overlay positioning logic
- Error handling
- File serving

### To Run Backend Example:

```bash
npm install express sharp
node backend-example.js
```

## 🎨 Features

### 1. Single Base Image
- One base room image: `assets/room_wall1_floor1_table1.jpg`
- Reduces asset size significantly

### 2. All Sheets in Modal
- Shows **all 9 sheets** regardless of hotspot
- User has complete freedom to choose any sheet for any area

### 3. Overlay Rendering
- Overlays are positioned absolutely on base image
- Multiple overlays can coexist
- Proper z-index layering

### 4. State Management
```javascript
// Tracks selected sheet names
currentSelection = { Wall: null, Floor: null, Pillars: null }

// Stores overlay image URLs from backend
overlayImages = { Wall: null, Floor: null, Pillars: null }
```

## 🎯 Hotspot Coordinates

```javascript
const hotspots = [
    { name: 'Wall', x: 0.95, y: 0.15 },
    { name: 'Pillars', x: 0.8, y: 0.60 },
    { name: 'Floor', x: 0.40, y: 0.82 }
];
```

## 📦 Available Sheets

Located in `assets/sheets/`:
- wall1.png, wall2.png, wall3.png
- bed1.png, bed2.png, bed3.png
- pillar1.png, pillar2.png, pillar3.png

## 🔍 What's Different

### HTML Changes
- Removed old `roomData` object
- Added `loadAvailableSheets()` function
- New `applySheet()` function for API calls
- Added `renderOverlays()` for overlay management
- Console logging for debugging

### CSS Changes
- Removed `overflow: hidden` from `.image-container`
- Added `.overlay-image` class
- Updated `#roomImage` positioning
- Support for absolute positioning of overlays

## ⚡ Next Steps

1. **Backend Development**: Implement the API endpoint
2. **Image Processing**: Set up image manipulation logic
3. **API Integration**: Connect frontend to backend
4. **Testing**: Test with real API calls
5. **Optimization**: Add caching, loading states
6. **Error Handling**: Improve user feedback

## 🐛 Debugging

All API-related actions are logged to the console with emojis:
- 🎯 API call initiated
- 📤 Request data
- ✅ Success
- ❌ Error

## 📝 Notes

- Currently in **dummy mode** - no real API calls
- All request data is logged for debugging
- Overlay rendering is fully functional
- Ready for backend integration
- No breaking changes to UI/UX

## 🤝 Support

For questions or issues:
1. Check `API_INTEGRATION_GUIDE.md`
2. Review `backend-example.js`
3. Check browser console for logs
4. Verify file paths are correct

---

**Status**: ✅ Frontend Ready | ⏳ Backend Pending | 🧪 Testing Mode
