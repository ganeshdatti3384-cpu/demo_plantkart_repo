# Module 10: File Storage System

## Overview
Implements secure binary file storage for the platform with automatic expiration, size limits, and admin cleanup capabilities. Files are stored directly in MongoDB with metadata tracking.

## Endpoints

### 1. Upload File
**POST** `/api/files/upload`

Upload a new file to the platform.

**Authentication:** Required (JWT token via `x-user-id` header)

**Request:**
```
FormData:
- file: File (PDF, JPG, PNG, GIF, WebP, DOCX)
- fileType: string (optional: 'resume', 'accommodation', 'car', 'general')
```

**Response (201):**
```json
{
  "fileId": "ObjectId",
  "fileName": "document.pdf",
  "size": 2048576,
  "message": "File uploaded successfully"
}
```

**Validations:**
- File size: Max 16MB
- Allowed MIME types: application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
- User must be authenticated

---

### 2. Download File
**GET** `/api/files/[id]`

Download a file by ID with proper headers for browser handling.

**Authentication:** None required (but file must be active)

**Response (200):**
Binary file data with headers:
- `Content-Type`: File's MIME type
- `Content-Disposition`: attachment; filename="..."
- `Content-Length`: File size

**Error Responses:**
- 400: Invalid file ID
- 404: File not found or inactive
- 410: File has expired

---

### 3. Get File Metadata
**GET** `/api/files/[id]/metadata`

Retrieve file information without downloading binary data.

**Authentication:** None required

**Response (200):**
```json
{
  "fileId": "ObjectId",
  "fileName": "resume.pdf",
  "mimeType": "application/pdf",
  "size": 1024000,
  "fileType": "resume",
  "uploadedAt": "2026-01-14T10:30:00Z",
  "expiresAt": "2026-04-14T10:30:00Z",
  "uploadedBy": "userId"
}
```

---

### 4. List User Files
**GET** `/api/files/list?fileType=[type]`

Retrieve all files uploaded by the authenticated user.

**Authentication:** Required

**Query Parameters:**
- `fileType` (optional): Filter by file type ('resume', 'accommodation', 'car', 'general')

**Response (200):**
```json
{
  "total": 5,
  "files": [
    {
      "fileId": "ObjectId",
      "fileName": "resume.pdf",
      "mimeType": "application/pdf",
      "size": 1024000,
      "fileType": "resume",
      "uploadedAt": "2026-01-14T10:30:00Z",
      "expiresAt": "2026-04-14T10:30:00Z"
    }
  ]
}
```

---

### 5. File Cleanup (Admin)
**POST** `/api/files/cleanup`

Clean up expired and orphaned files. Admin-only endpoint.

**Authentication:** Required (admin or super_admin role)

**Response (200):**
```json
{
  "message": "File cleanup completed",
  "stats": {
    "deletedExpiredFiles": 5,
    "deactivatedOrphanedFiles": 3,
    "timestamp": "2026-01-14T10:30:00Z"
  }
}
```

**Actions:**
- Deletes files where `expiresAt < now`
- Marks files older than 180 days as inactive
- Creates audit log entry

---

## Data Structure

### Files Collection Schema
```typescript
{
  _id: ObjectId,
  fileName: string,
  mimeType: string,
  size: number,                  // bytes
  fileType: 'resume' | 'accommodation' | 'car' | 'general',
  data: Buffer,                  // binary file content
  uploadedBy: string,            // userId
  createdAt: Date,
  expiresAt: Date,               // auto-delete after 90 days
  isActive: boolean              // soft delete flag
}
```

---

## Integration with Other Modules

### Resume Module
- Upload PDF via `/api/files/upload` with `fileType: 'resume'`
- Store `originalPdfFileId` in `user_resumes` collection
- Retrieve PDF via `/api/files/[fileId]` endpoint
- Updated: `/api/resume/optimize` now uses file storage system

### Accommodation Module
- Store listing images in files collection
- Reference image fileId in accommodation documents
- Serve images via `/api/files/[id]` endpoint

### Car Module
- Store vehicle images in files collection
- Reference image fileId in car documents
- Serve images via `/api/files/[id]` endpoint

---

## Security Features

1. **Authentication & Authorization:**
   - Upload/list require valid JWT token
   - Cleanup restricted to admin/super_admin roles

2. **File Validation:**
   - MIME type whitelist enforced
   - File size limit: 16MB per file
   - Filename sanitization

3. **Expiration:**
   - Auto-expiry after 90 days
   - Expired files return 410 Gone status
   - Cleanup removes truly expired files

4. **Audit Logging:**
   - File cleanup operations logged with admin details
   - Audit trail maintained in `audit_logs` collection

---

## Configuration

Environment variables (from `.env.local`):
```
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
```

---

## Usage Examples

### Upload Resume PDF
```javascript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('fileType', 'resume');

const response = await fetch('/api/files/upload', {
  method: 'POST',
  headers: {
    'x-user-id': userId,
    'x-user-role': 'user'
  },
  body: formData
});

const { fileId } = await response.json();
```

### Download File
```javascript
const response = await fetch(`/api/files/${fileId}`);
const blob = await response.blob();
// Automatically downloads with filename
```

### List Resume Files
```javascript
const response = await fetch('/api/files/list?fileType=resume', {
  headers: {
    'x-user-id': userId,
    'x-user-role': 'user'
  }
});

const { files } = await response.json();
```

### Admin Cleanup
```javascript
const response = await fetch('/api/files/cleanup', {
  method: 'POST',
  headers: {
    'x-user-id': adminId,
    'x-user-role': 'admin'
  }
});

const { stats } = await response.json();
```

---

## Performance Considerations

- **Binary Storage:** Files stored directly in MongoDB (16MB limit per document)
- **Indexing:** Consider adding indexes on `uploadedBy`, `createdAt`, `expiresAt` for large deployments
- **GridFS Migration:** For files >16MB, implement GridFS adapter in production
- **Caching:** Download endpoints include 1-hour cache headers for frequently accessed files

---

## Future Enhancements

1. Implement GridFS for files >16MB
2. Add virus scanning on upload
3. Implement CDN integration for image serving
4. Add file versioning for resumes
5. Implement user file quota limits
6. Add batch download/zip functionality
