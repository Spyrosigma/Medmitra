"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientInfo {
  name: string;
  age: string;
  gender: string;
}

interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onChange: (field: keyof PatientInfo, value: string) => void;
}

export default function PatientInfoForm({ patientInfo, onChange }: PatientInfoFormProps) {
  return (
    <Card className="p-3">
      {/* <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <User className="h-4 w-4" />
        Patient Information
      </h3> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="space-y-2">
          <Label htmlFor="patientName">
            Patient Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="patientName"
            value={patientInfo.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter patient name"
            className="transition-colors text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patientAge">Age <span className="text-destructive">*</span></Label>
          <Input
            id="patientAge"
            type="number"
            value={patientInfo.age}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="Enter age"
            min="0"
            max="150"
            className="transition-colors text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patientGender">Gender <span className="text-destructive">*</span></Label>
          <Select
            value={patientInfo.gender}
            onValueChange={(value) => onChange('gender', value)}
          >
            <SelectTrigger className="transition-colors text-sm">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Transgender">Transgender</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* <div className="space-y-2">
          <Label htmlFor="caseTitle">
            Case Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="caseTitle"
            value={patientInfo.caseTitle}
            onChange={(e) => onChange('caseTitle', e.target.value)}
            placeholder="Brief description of the case"
            className="transition-colors text-sm"
          />
        </div> */}
      </div>
    </Card>
  );
} 