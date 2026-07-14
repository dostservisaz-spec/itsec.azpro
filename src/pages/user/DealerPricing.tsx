import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Product } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DealerPricing = () => {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [margins, setMargins] = useState({ dealer: 0.02 });

  useEffect(() => {
    fetchMargins();
    fetchProducts();
  }, []);

  const fetchMargins = async () => {
    try {
      const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
      if (data) setMargins({ dealer: Number(data.dealer_margin) || 0.02 });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`*, brands(name)`)
        .order('name_az');
        
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (profile?.role !== 'dealer') return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Diler Qiymət Cədvəli</h1>
        <p className="text-muted-foreground">Sizin üçün xüsusi olaraq hesablanmış topdan alış qiymətləri</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="w-full max-w-full overflow-x-auto bg-card">
          <Table className="[&>div]:max-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50 whitespace-nowrap">
                <TableHead>Məhsul / SKU</TableHead>
                <TableHead>Brend</TableHead>
                <TableHead className="text-right">Baza Qiymət</TableHead>
                <TableHead className="text-right">Diler Qiyməti</TableHead>
                <TableHead className="text-center">Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Yüklənir...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Məhsul tapılmadı</TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const dealerPrice = product.base_price * (1 + margins.dealer);
                  return (
                    <TableRow key={product.id} className="whitespace-nowrap">
                      <TableCell>
                        <div className="font-medium text-wrap max-w-xs">{product.name_az}</div>
                        <div className="text-xs text-muted-foreground">{product.sku}</div>
                      </TableCell>
                      <TableCell>{product.brands?.name || '-'}</TableCell>
                      <TableCell className="text-right">{product.base_price.toFixed(2)} ₼</TableCell>
                      <TableCell className="text-right font-bold text-primary">{dealerPrice.toFixed(2)} ₼</TableCell>
                      <TableCell className="text-center">
                        {product.stock_quantity > 0 ? (
                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Stokda ({product.stock_quantity})</span>
                        ) : (
                          <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">Yoxdur</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DealerPricing;
