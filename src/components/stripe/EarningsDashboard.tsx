import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { formatAmount } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Transaction {
  id: string;
  amount: number;
  platform_fee: number;
  currency: string;
  status: string;
  created_at: string;
  sequences: {
    title: string;
  };
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface EarningsDashboardProps {
  userId: string;
}

export function EarningsDashboard({ userId }: EarningsDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('stripe_transactions')
        .select(`
          id,
          amount,
          platform_fee,
          currency,
          status,
          created_at,
          sequences (
            title
          )
        `)
        .eq('seller_id', userId)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false });

      if (transactionError) throw transactionError;

      // Fetch payouts
      const { data: payoutData, error: payoutError } = await supabase
        .from('stripe_payouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (payoutError) throw payoutError;

      // Calculate totals
      const total = transactionData?.reduce((sum, tx) => sum + (tx.amount - tx.platform_fee), 0) || 0;
      const paidOut = payoutData?.reduce((sum, payout) => sum + payout.amount, 0) || 0;
      
      setTransactions(transactionData || []);
      setPayouts(payoutData || []);
      setTotalEarnings(total);
      setAvailableBalance(total - paidOut);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load earnings data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = () => {
    const monthlyData = transactions.reduce((acc, tx) => {
      const date = new Date(tx.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const earnings = tx.amount - tx.platform_fee;
      
      acc[monthYear] = (acc[monthYear] || 0) + earnings;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      earnings: amount / 100, // Convert cents to dollars
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading earnings data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalEarnings, 'USD')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(availableBalance, 'USD')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions and Payouts Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{tx.sequences.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatAmount(tx.amount - tx.platform_fee, tx.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Platform fee: {formatAmount(tx.platform_fee, tx.currency)}
                      </div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No transactions yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <div className="font-medium">
                        Payout {payout.status === 'paid' ? 'completed' : payout.status}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payout.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatAmount(payout.amount, payout.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Status: {payout.status}
                      </div>
                    </div>
                  </div>
                ))}
                {payouts.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No payouts yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 