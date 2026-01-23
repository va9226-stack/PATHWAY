"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { Bot, CheckCircle2, XCircle, BrainCircuit, SlidersHorizontal, BarChart2, Undo2, Shield, Atom, Eye, Volume2, Waves, Accessibility } from "lucide-react";

import { runSimulation, type SimulationResult } from "@/app/actions";
import { LoadingSpinner } from "@/components/loading-spinner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  problemStatement: z.string().min(10, {
    message: "Please describe your problem in at least 10 characters.",
  }),
  maxAttempts: z.array(z.number()).min(1).max(1),
  coherenceThreshold: z.array(z.number()).min(1).max(1),
  intelligenceLevel: z.array(z.number()).min(1).max(1),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemStatement: "",
      maxAttempts: [5],
      coherenceThreshold: [0.6],
      intelligenceLevel: [3],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runSimulation({
        problemStatement: values.problemStatement,
        maxAttempts: values.maxAttempts[0],
        coherenceThreshold: values.coherenceThreshold[0],
        intelligenceLevel: values.intelligenceLevel[0],
      });
      setResult(response);
    } catch (error) {
      console.error("Simulation failed:", error);
      // Here you could use a toast to show the error
    } finally {
      setIsLoading(false);
    }
  }

  const handleExplorePath = (newProblem: string) => {
    form.setValue("problemStatement", newProblem, { shouldValidate: true });
    form.handleSubmit(onSubmit)();
  };

  const chartData = result?.attemptResults.map(attempt => ({
    name: `Attempt ${attempt.attemptNumber}`,
    coherence: attempt.coherence,
    fill: attempt.coherence >= form.getValues().coherenceThreshold[0] ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
  }));

  const chartConfig = {
    coherence: {
      label: "Coherence",
    },
  };

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Lucidity Lens
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bring clarity to your complex decisions. Describe your problem, and our AI will simulate potential paths to illuminate the best course of action.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit />
              Start Your Simulation
            </CardTitle>
            <CardDescription>
              Define your problem and set the simulation parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="problemStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Should I launch my new product in Q3 or wait until Q4?"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Clearly state the choice you are considering.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="maxAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Attempts: {field.value[0]}</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                         <FormDescription>
                          Number of YES-paths to explore.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coherenceThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coherence Threshold: {field.value[0]}</FormLabel>
                        <FormControl>
                          <Slider
                            min={0.1}
                            max={1}
                            step={0.05}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum score for a successful path.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="intelligenceLevel"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <Atom className="h-4 w-4" />
                          AI Particle Intelligence: {field.value[0]}
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Higher levels produce more detailed analysis.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Simulating...
                    </>
                  ) : (
                    "Run Simulation"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
             <LoadingSpinner className="h-8 w-8 text-primary" />
             <p className="text-muted-foreground">AI is exploring possibilities... this may take a moment.</p>
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-8 animate-in fade-in-0 duration-500">
            <Card className={result.decision === 'YES' ? 'border-accent bg-accent/10' : 'border-destructive bg-destructive/10'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {result.decision === 'YES' ? (
                    <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
                  ) : (
                    <XCircle className="h-8 w-8 text-destructive-foreground" />
                  )}
                  Final Decision: {result.decision}
                </CardTitle>
                <CardDescription className="pt-2 text-lg">
                  {result.reason}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 />
                  Attempt Analysis
                </CardTitle>
                <CardDescription>
                  Visualization of each simulated attempt's coherence score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer>
                      <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ReferenceLine y={form.getValues().coherenceThreshold[0]} label="Threshold" stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                        <Bar dataKey="coherence" radius={4}>
                           {chartData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal />
                  Detailed Justifications
                </CardTitle>
                <CardDescription>
                  The AI's reasoning behind each attempt's coherence score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                      {result.attemptResults.map((attempt) => (
                        <AccordionItem value={`item-${attempt.attemptNumber}`} key={attempt.attemptNumber}>
                          <AccordionTrigger>
                            <div className="flex w-full items-center gap-4">
                              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${attempt.success ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
                                {attempt.attemptNumber}
                              </span>
                              <div className="flex-grow text-left">
                                Attempt {attempt.attemptNumber} - Coherence: {attempt.coherence} ({attempt.success ? "Success" : "Fail"})
                              </div>
                              <div className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
                                <div className={cn("flex items-center gap-1.5", !attempt.reversible && 'text-destructive')}>
                                    <Undo2 className="h-4 w-4" />
                                    <span>{attempt.reversible ? 'Reversible' : 'Irreversible'}</span>
                                </div>
                                <div className={cn("flex items-center gap-1.5", !attempt.safe && 'text-destructive')}>
                                    <Shield className="h-4 w-4" />
                                    <span>{attempt.safe ? 'Safe' : 'Risky'}</span>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="prose prose-sm max-w-none text-muted-foreground pl-16">
                            <p>{attempt.justification}</p>
                             <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground md:hidden">
                                <div className={cn("flex items-center gap-1.5", !attempt.reversible && 'text-destructive')}>
                                    <Undo2 className="h-4 w-4" />
                                    <span>{attempt.reversible ? 'Reversible' : 'Irreversible'}</span>
                                </div>
                                <div className={cn("flex items-center gap-1.5", !attempt.safe && 'text-destructive')}>
                                    <Shield className="h-4 w-4" />
                                    <span>{attempt.safe ? 'Safe' : 'Risky'}</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => handleExplorePath(attempt.justification)}
                              >
                                <BrainCircuit className="mr-2 h-4 w-4" />
                                Explore this Path
                              </Button>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility />
                  Sensory Synthesis
                </CardTitle>
                <CardDescription>
                  The AI's metaphorical perception of the simulation process.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Eye className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Divine Sight</h4>
                    <p className="text-muted-foreground">{result.divineSight}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Volume2 className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Divine Sound</h4>
                    <p className="text-muted-foreground">{result.divineSound}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Waves className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Divine Touch</h4>
                    <p className="text-muted-foreground">{result.divineTouch}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
