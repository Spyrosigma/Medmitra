"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, FileText, FileImage, File } from "lucide-react";
import { DragDropArea } from "@/components/cases/drag-drop-area";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  category: string;
}

interface FileUploadProps {
  category: string;
  title: string;
  acceptedTypes: string[];
  acceptedExtensions: string[];
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: FileList | null, category: string) => void;
  onRemoveFile: (fileId: string) => void;
  icon?: React.ReactNode;
  description?: string;
  multiple?: boolean;
}

const getFileIcon = (fileName: string, category: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (category === 'lab' || extension === 'pdf' || extension === 'csv') {
    return <FileText className="h-4 w-4" />;
  }
  
  if (category === 'radiology' || ['jpg', 'jpeg', 'png', 'dcm', 'dicom'].includes(extension || '')) {
    return <FileImage className="h-4 w-4" />;
  }
  
  return <File className="h-4 w-4" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileUpload({
  category,
  title,
  acceptedTypes,
  acceptedExtensions,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  icon = <Upload className="h-4 w-4" />,
  description,
  multiple = true
}: FileUploadProps) {
  const categoryFiles = uploadedFiles.filter(f => f.category === category);

  // Handle files dropped from drag-drop area
  const handleFilesDrop = (droppedFiles: File[]) => {
    // Convert File[] to FileList-like object
    const fileList = {
      length: droppedFiles.length,
      item: (index: number) => droppedFiles[index],
      [Symbol.iterator]: function* () {
        for (let i = 0; i < this.length; i++) {
          yield this.item(i);
        }
      }
    } as FileList;

    onFileUpload(fileList, category);
  };

  // Get max file size based on category (in MB)
  const getMaxFileSize = () => {
    if (category === 'lab') return 10; // 10MB for lab reports
    if (category === 'radiology') return 50; // 50MB for radiology images
    return 10; // Default 10MB
  };

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {/* Drag and Drop Area */}
        <DragDropArea
          onFilesDrop={handleFilesDrop}
          acceptedTypes={acceptedExtensions.map(ext => `.${ext}`)}
          maxFileSize={getMaxFileSize()}
          className="min-h-[70px]"
        />
        
        {description && (
          <p className="text-xs text-muted-foreground text-center">
            {description}
          </p>
        )}

        {/* Files List */}
        {categoryFiles.length > 0 && (
          <div className="space-y-1">
            {categoryFiles.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getFileIcon(file.name, category)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(file.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
} 