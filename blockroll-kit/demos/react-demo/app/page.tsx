'use client';

import { useState } from 'react';
import { useBlockRoll, useMyFiles, useNotifications } from '@blockroll/react-sdk';

export default function HomePage() {
  const { uploadFile, shareFile, downloadFile, loading, error } = useBlockRoll();
  const { files, refetch } = useMyFiles({ limit: 10 });
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shareWallet, setShareWallet] = useState('');

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadFile({
        file: selectedFile,
        accessType: 'private',
        encryption: true,
      });

      alert(`File uploaded! ID: ${result.fileId}`);
      setSelectedFile(null);
      refetch();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleShare = async (fileId: string) => {
    if (!shareWallet) {
      alert('Please enter a wallet address');
      return;
    }

    try {
      await shareFile({
        fileId,
        recipientWallet: shareWallet,
        accessLevel: 'view',
      });

      alert('File shared successfully!');
      setShareWallet('');
    } catch (err: any) {
      alert(`Share failed: ${err.message}`);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const blob = await downloadFile(fileId);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎲 BlockRoll React SDK Demo</h1>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {/* Upload Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>📤 Upload File</h2>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          style={{ marginRight: '1rem' }}
        />
        <button onClick={handleUpload} disabled={loading || !selectedFile}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {/* Files List */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>📁 My Files ({files.total})</h2>
        
        {files.data.map((file) => (
          <div
            key={file.id}
            style={{
              padding: '1rem',
              background: '#f9f9f9',
              borderRadius: '4px',
              marginBottom: '0.5rem',
            }}
          >
            <h3>{file.name}</h3>
            <p>Size: {Math.round(file.size / 1024)} KB</p>
            <p>Type: {file.type}</p>
            <p>Status: {file.status}</p>
            
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={() => handleDownload(file.id, file.name)}
                style={{ marginRight: '0.5rem' }}
              >
                Download
              </button>
              
              <input
                type="text"
                placeholder="Wallet address (0x...)"
                value={shareWallet}
                onChange={(e) => setShareWallet(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              
              <button onClick={() => handleShare(file.id)}>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>🔔 Notifications ({unreadCount})</h2>
        
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markAsRead(notif.id)}
            style={{
              padding: '0.75rem',
              background: notif.read ? '#f9f9f9' : '#e3f2fd',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <p style={{ margin: 0, fontWeight: notif.read ? 'normal' : 'bold' }}>
              {notif.message}
            </p>
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

