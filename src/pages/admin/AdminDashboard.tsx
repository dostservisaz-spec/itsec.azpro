import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsCount, customersCount, ordersCount] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
          supabase.from('orders').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          products: productsCount.count || 0,
          customers: customersCount.count || 0,
          orders: ordersCount.count || 0,
          revenue: 0 // Will be calculated from real orders later
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
                <div className="h-6 w-6 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-1/2 bg-muted rounded mb-1 mt-2"></div>
                <div className="h-3 w-2/3 bg-muted rounded mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <div className="bg-blue-50 p-2.5 rounded-lg text-blue-500">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-slate-900">{stats.orders}</div>
              <p className="text-sm font-medium text-slate-500 mt-1">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <div className="bg-green-50 p-2.5 rounded-lg text-green-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-slate-900 flex items-center gap-1">
                <span>₼</span>{stats.revenue.toFixed(0)}
              </div>
              <p className="text-sm font-medium text-slate-500 mt-1">Total Revenue</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <div className="bg-purple-50 p-2.5 rounded-lg text-purple-500">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-slate-900">{stats.customers}</div>
              <p className="text-sm font-medium text-slate-500 mt-1">Customers</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <div className="bg-red-50 p-2.5 rounded-lg text-[#cc0000]">
                <Package className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-3xl font-bold text-slate-900">{stats.products}</div>
              <p className="text-sm font-medium text-slate-500 mt-1">Products</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-row items-center gap-2">
            <div className="w-1 h-4 bg-[#cc0000] rounded-sm"></div>
            <CardTitle className="text-base font-semibold text-slate-900">Monthly Revenue (₼)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-end gap-2 pb-6 px-6 pt-6 relative">
            <div className="absolute left-6 top-6 bottom-12 flex flex-col justify-between text-[10px] text-slate-400">
              <span>10000</span>
              <span>7500</span>
              <span>5000</span>
              <span>2500</span>
              <span>0</span>
            </div>
            {/* Mock Bar Chart matching screenshot 5 */}
            <div className="w-full flex justify-between items-end h-full pl-10">
              {[40, 60, 50, 75, 75, 85].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-full">
                  <div 
                    className="w-[85%] bg-[#cc0000] rounded-t-sm transition-all hover:opacity-90" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-[11px] font-medium text-slate-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-row items-center gap-2">
            <div className="w-1 h-4 bg-[#cc0000] rounded-sm"></div>
            <CardTitle className="text-base font-semibold text-slate-900">Orders Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center relative px-6 pb-6 pt-6">
             <div className="absolute left-6 top-6 bottom-12 flex flex-col justify-between text-[10px] text-slate-400 z-10">
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
             </div>
             {/* Mock Line Chart matching screenshot 5 */}
             <div className="w-full h-full relative pl-8">
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[calc(100%-24px)] absolute top-0 left-8 right-0 overflow-visible">
                 <path 
                   d="M0,70 Q20,50 40,55 T80,45 T100,30" 
                   fill="none" 
                   stroke="#cc0000" 
                   strokeWidth="2.5" 
                   vectorEffect="non-scaling-stroke"
                 />
                 <circle cx="50" cy="53" r="2.5" fill="#cc0000" className="drop-shadow-md" />
                 <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
               </svg>
               <div className="absolute top-[40%] left-[50%] bg-[#0f172a] text-[#cc0000] text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-[120%] font-medium z-20">
                 orders : 38
               </div>
               <div className="absolute bottom-0 left-8 right-0 flex justify-between pt-3">
                 {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                    <span key={m} className="text-[11px] font-medium text-slate-500">{m}</span>
                 ))}
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 rounded-xl">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-row items-center gap-2">
          <div className="w-1 h-4 bg-[#cc0000] rounded-sm"></div>
          <CardTitle className="text-base font-semibold text-slate-900">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-5 text-xs font-semibold text-slate-500 px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div>Order #</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Total</div>
            <div>Date</div>
          </div>
          <div className="py-12 text-center text-sm text-slate-400">
            No recent orders found
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
