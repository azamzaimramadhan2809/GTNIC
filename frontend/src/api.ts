import { createContext, useContext, useEffect, useState } from 'react';
export interface Warung { id: number; name: string }
export interface User { id: number; name: string; email: string }
export interface Ingredient { id: number; name: string; ingredient_category_id: number; category: {id: number; name: string}; purchase_price: string; stock: string; minimum_stock: string; unit: string }
export interface Menu { id: number; name: string; category: {name: string} | null; price: string; available_stock: number; is_available: boolean }
export interface Sale { id: number; total: string; subtotal: string; discount: string; tax: string; created_at: string; payment: {method: string; received_amount: string; change_amount: string}; sale_items: {quantity: number; menu: {name: string}}[] }
export interface Report { summary: {revenue: number; estimated_profit: number; sales_count: number; average_order: number; profit_margin: number}; chart: {label: string; revenue: number; profit: number; transactions: number}[]; top_products: {id: number; name: string; category: string; sold: number; revenue: number; rank: number; icon: string; percentage: number}[]; categories: {name: string; revenue: number; percentage: number}[]; transactions: {id: string; time: string; date: string; items: string; itemCount: number; payment: 'Tunai' | 'QRIS' | 'Transfer'; total: number; status: 'selesai' | 'refund'}[]; profit_basis: string }
export const message = (e: unknown) => e instanceof Error ? e.message : 'Permintaan gagal.';
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('nexa_token') ?? localStorage.getItem('nexa_token');
  const response = await fetch('/api' + path, { ...options, headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token ? {Authorization: 'Bearer ' + token} : {}), ...options.headers } });
  const body = await response.json().catch(() => ({ message: 'Server tidak mengirim respons JSON. Pastikan backend berjalan.' }));
  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem('nexa_token');
      localStorage.removeItem('nexa_token');
      window.dispatchEvent(new Event('nexa:logout'));
    }
    throw new Error(body.errors ? Object.values(body.errors).flat().join(' ') : body.message || 'Permintaan gagal.');
  }
  return body as T;
}
export async function allPages<T>(path: string, key: string): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; ; page++) {
    const result = await api<Record<string, {data: T[]; last_page: number}>>(path + (path.includes('?') ? '&' : '?') + 'page=' + page);
    rows.push(...result[key].data);
    if (page >= result[key].last_page) return rows;
  }
}
export function useData<T>(path: string) {
  const [state, setState] = useState<{path: string; data?: T; error?: string}>({path});
  useEffect(() => { let active = true; api<T>(path).then(data => {if(active) setState({path, data});}).catch(e => {if(active) setState({path, error: message(e)});}); return () => {active = false;}; }, [path]);
  return state.path === path ? state : {path};
}
export const Session = createContext<{user: User; warung: Warung} | null>(null);
export function useSession() { const value=useContext(Session); if(!value) throw new Error('Sesi belum siap'); return value; }
export function dateRange(period: string) {
  const to=new Date(), from=new Date();
  if(period==='7_hari') from.setDate(to.getDate()-6);
  if(period==='minggu_ini') from.setDate(to.getDate()-((to.getDay()+6)%7));
  if(period==='bulan_ini') from.setDate(1);
  const format=(d:Date)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  return {from:format(from),to:format(to)};
}
