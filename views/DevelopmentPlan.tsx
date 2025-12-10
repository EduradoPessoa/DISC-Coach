import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIHelper } from '../components/ui/AIHelper';
import { Target, Calendar, CheckSquare } from 'lucide-react';

const DevelopmentPlan = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Development Plan</h1>
        <p className="text-slate-500">Actionable steps to enhance executive impact.</p>
      </div>

      {/* AI Generator Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-white border-indigo-100">
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">AI Coach Generation</h3>
                <p className="text-sm text-slate-600 mb-4">
                    Generate a personalized Individual Development Plan (IDP) based on your recent assessment results (High C / High D).
                </p>
                <AIHelper 
                    mode="coach" 
                    title="Generate New Plan"
                    discProfile="High Compliance, High Dominance"
                    contextData={{ goal: "Improve team empathy and agility", timeframe: "Q4" }}
                    promptTemplate="Create a 3-step development plan with specific metrics for this profile to improve agility and empathy."
                />
            </div>
        </div>
      </Card>

      {/* Current Active Plan */}
      <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Current Focus Areas</h3>
      <div className="grid gap-4">
        <Card>
            <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mt-1">
                    <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900">Delegation of Quality Control</h4>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">In Progress</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                        Stop reviewing every minor report. Establish standards and trust direct reports to execute.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Due: Oct 15</div>
                        <div className="flex items-center gap-1"><CheckSquare className="w-3 h-3"/> 1/3 Actions</div>
                    </div>
                </div>
                <Button label="Update" variant="ghost" className="text-sm" />
            </div>
        </Card>
        
        <Card>
            <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600 mt-1">
                    <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900">Stakeholder Communication</h4>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Planned</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                        Practice "Bottom Line Up Front" (BLUF) in verbal updates, but add personal connection time at start of meetings.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Due: Nov 01</div>
                        <div className="flex items-center gap-1"><CheckSquare className="w-3 h-3"/> 0/2 Actions</div>
                    </div>
                </div>
                <Button label="Start" variant="ghost" className="text-sm" />
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DevelopmentPlan;