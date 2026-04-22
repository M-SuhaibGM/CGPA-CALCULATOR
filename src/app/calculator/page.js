"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RefreshCcw, Plus, Percent } from 'lucide-react';
import { toast } from "sonner";

const CGPACalculator = () => {
  const [numSubjects, setNumSubjects] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [result, setResult] = useState(null);

  // Generate input rows based on number of subjects
  const generateFields = () => {
    const count = parseInt(numSubjects);
    if (isNaN(count) || count <= 0 || count > 12) {
      return toast.error("Please enter a valid number of subjects (1-12)");
    }
    const newSubjects = Array.from({ length: count }, () => ({
      marks: "",
      credits: ""
    }));
    setSubjects(newSubjects);
    setIsGenerated(true);
    setResult(null);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  // Convert marks to Grade Points (Standard Scale)
  const getGP = (marks) => {
    const m = parseFloat(marks);
    if (m >= 80) return 4.0;
    if (m >= 75) return 3.7;
    if (m >= 70) return 3.3;
    if (m >= 65) return 3.0;
    if (m >= 60) return 2.7;
    if (m >= 55) return 2.3;
    if (m >= 50) return 2.0;
    return 0.0;
  };

  const calculateCGPA = () => {
    let totalQualityPoints = 0;
    let totalCredits = 0;

    for (let sub of subjects) {
      if (!sub.marks || !sub.credits) {
        return toast.error("Please fill all marks and credit hours");
      }
      const gp = getGP(sub.marks);
      const cr = parseFloat(sub.credits);
      totalQualityPoints += gp * cr;
      totalCredits += cr;
    }

    const finalCGPA = totalQualityPoints / totalCredits;
    setResult(finalCGPA.toFixed(2));
    toast.success("CGPA Calculated!");
  };

  const reset = () => {
    setIsGenerated(false);
    setNumSubjects("");
    setSubjects([]);
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="text-blue-600" /> Semester GPA Calculator
          </CardTitle>
          <CardDescription>Calculate your GPA based on marks and credit hours</CardDescription>
        </CardHeader>
        <CardContent>
          {!isGenerated ? (
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">How many subjects this semester?</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 5" 
                  value={numSubjects} 
                  onChange={(e) => setNumSubjects(e.target.value)}
                />
              </div>
              <Button onClick={generateFields} className="bg-blue-600">
                Generate Fields <Plus className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-bold text-sm text-muted-foreground pb-2 border-b">
                <div className="col-span-2">Sub #</div>
                <div className="col-span-5">Marks (Out of 100)</div>
                <div className="col-span-5">Credit Hours</div>
              </div>

              {subjects.map((sub, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 font-medium">#{index + 1}</div>
                  <div className="col-span-5">
                    <Input 
                      type="number" 
                      placeholder="e.g. 85" 
                      value={sub.marks}
                      onChange={(e) => handleInputChange(index, 'marks', e.target.value)}
                    />
                  </div>
                  <div className="col-span-5">
                    <Input 
                      type="number" 
                      placeholder="e.g. 3" 
                      value={sub.credits}
                      onChange={(e) => handleInputChange(index, 'credits', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-6">
                <Button onClick={calculateCGPA} className="flex-1 bg-green-600 hover:bg-green-700">
                  Calculate CGPA
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-blue-600 text-white text-center py-8 animate-in fade-in zoom-in duration-300">
          <CardContent className="p-0">
            <p className="text-lg opacity-90">Your Estimated GPA is</p>
            <h2 className="text-6xl font-black mt-2">{result}</h2>
            <div className="mt-4 inline-flex items-center bg-white/20 px-4 py-1 rounded-full text-sm">
              <Percent className="h-4 w-4 mr-2" /> Out of 4.00
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CGPACalculator;