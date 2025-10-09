'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lightbulb, ArrowRight } from "lucide-react";

interface GrowthInsights {
  insights: string[];
  nextSteps: string[];
}

function InsightsLoading() {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating your personalized insights...</p>
        </div>
    )
}

interface GrowthClientPageProps {
    insights: GrowthInsights | null;
    error: string | null;
}

export default function GrowthClientPage({ insights, error }: GrowthClientPageProps) {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-8">Growth & Analytics</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-accent" />
                        AI-Powered Growth Insights
                    </CardTitle>
                    <CardDescription>
                        Personalized tips and next steps based on your last 30 days of activity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!insights && !error && <InsightsLoading />}
                    {error && <p className="text-destructive text-center p-8">{error}</p>}
                    {insights && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Key Insights</h3>
                                <ul className="space-y-3 list-disc pl-5 text-muted-foreground">
                                    {insights.insights.map((insight, index) => (
                                        <li key={`insight-${index}`}>{insight}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Actionable Next Steps</h3>
                                <ul className="space-y-3">
                                    {insights.nextSteps.map((step, index) => (
                                        <li key={`step-${index}`} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                                           <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-1" /> 
                                           <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
