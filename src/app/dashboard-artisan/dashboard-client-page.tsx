'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Users, Eye, DollarSign } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { salesData } from "@/lib/data";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";
import type { Product } from '@/lib/types';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface DashboardClientPageProps {
    myProducts: Product[];
    totalRevenue: number;
    totalSales: number;
}

export default function DashboardClientPage({ myProducts, totalRevenue, totalSales }: DashboardClientPageProps) {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline mb-8">Artisan Dashboard</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,234</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalSales}</div>
                        <p className="text-xs text-muted-foreground">+3.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Followers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+57</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>Your revenue over the last 6 months.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart accessibilityLayer data={salesData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                             <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => `${value}`}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                  <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>An overview of your most recent sales.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {myProducts.slice(0, 3).map((product, index) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell><Badge variant={index === 1 ? 'secondary' : index === 2 ? 'outline' : 'default'}>{index === 1 ? 'Processing' : index === 2 ? 'Fulfilled' : 'Shipped'}</Badge></TableCell>
                                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
            </div>
        </div>
    );
}
