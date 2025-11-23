'use client';

import React, { useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  targetId: string;
  fileName?: string;
}

export function ExportButton({ targetId, fileName = 'garden-plan.png' }: ExportButtonProps) {
  const handleExport = useCallback(() => {
    const node = document.getElementById(targetId);
    if (!node) {
      console.error('Node not found:', targetId);
      return;
    }

    // Get full dimensions including scroll area
    const width = node.scrollWidth;
    const height = node.scrollHeight;

    toPng(node, { 
      cacheBust: true, 
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      style: {
        overflow: 'visible', // Ensure hidden parts are rendered
        transform: 'none',   // Reset transforms
        maxWidth: 'none',    // Remove size constraints
        maxHeight: 'none',
      }
    })
      .then((dataUrl) => {
        console.log('Image generated, length:', dataUrl.length);
        if (dataUrl.length < 100) {
          console.error('Generated image data is too short, likely invalid.');
          alert('画像生成に失敗しました (データが空です)');
          return;
        }

        // Download
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to export image:', err);
        alert('画像書き出しに失敗しました: ' + err.message);
      });
  }, [targetId, fileName]);

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-300 rounded-lg shadow-sm text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
      title="画像として保存"
    >
      <Download size={16} />
      <span className="hidden sm:inline">保存</span>
    </button>
  );
}
