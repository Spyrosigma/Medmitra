"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Eye } from "lucide-react";

interface CaseActionsProps {
  onPreview: () => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  isFormValid: boolean;
  submitText?: string;
  submitingText?: string;
}

export default function CaseActions({
  onPreview,
  onSubmit,
  isSubmitting,
  isFormValid,
  submitText = "Create Case",
  submitingText = "Creating Case..."
}: CaseActionsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <Button 
          onClick={onPreview}
          variant="outline" 
          className="w-full hover:bg-accent/50 transition-colors"
          disabled={!isFormValid}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Case
        </Button>
        
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting || !isFormValid}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {submitingText}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {submitText}
            </>
          )}
        </Button>
        
      </div>
      
      {!isFormValid && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Please fill: Patient Name, Age, Gender, and Case Summary
          </p>
        </div>
      )}
    </Card>
  );
} 