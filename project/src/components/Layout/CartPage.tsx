import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CART_KEY = 'cart_items';

function readCart(){
  try{ const r = localStorage.getItem(CART_KEY); return r?JSON.parse(r):[] }catch{return []}
}
function writeCart(data){
  try{
    localStorage.setItem(CART_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('cart_updated'));
  } catch (err) { console.debug('writeCart error', err); }
}

export default function CartPage(){
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({name:'', email:'', phone:''});
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(()=> setItems(readCart()), []);

  const updateQty = (id, qty) => {
    const updated = items.map(i => i.id === id ? {...i, qty} : i);
    setItems(updated); writeCart(updated);
  }
  const remove = (id) => { const filtered = items.filter(i=>i.id!==id); setItems(filtered); writeCart(filtered); }

  const checkout = () => {
  if(!customer.name || !customer.email) return alert('Enter name and email');
    // create order + transaction
    const orders = (()=>{try{const r=localStorage.getItem('admin_orders'); return r?JSON.parse(r):[];}catch{return []}})();
    const txs = (()=>{try{const r=localStorage.getItem('admin_transactions'); return r?JSON.parse(r):[];}catch{return []}})();

    const orderId = orders.length ? Math.max(...orders.map(o=>o.id))+1 : 1;
    const total = items.reduce((s,i)=> s + (i.price||0) * (i.qty||1), 0);
  const contact = { ...customer, address };
  const order = { id: orderId, customer: customer.name, contact, total, items: items.map(i=>({productId:i.id, title:i.title, qty:i.qty, price:i.price})), status:'Pending' };
    orders.push(order);
    localStorage.setItem('admin_orders', JSON.stringify(orders));

    const txId = txs.length ? Math.max(...txs.map(t=>t.id))+1 : 1;
    const tx = { id: txId, orderId, amount: total, method:'card', date: new Date().toISOString(), customer: customer };
    txs.push(tx);
    localStorage.setItem('admin_transactions', JSON.stringify(txs));

    // decrement product stock in admin_products and persist
    try {
      const rawProducts = localStorage.getItem('admin_products');
      const products = rawProducts ? JSON.parse(rawProducts) : [];
      const updatedProducts = products.map((p) => {
        const cartItem = items.find((it) => it.id === p.id || it.id === p.productId || it.slug === p.slug);
        if (!cartItem) return p;
        const newStock = (typeof p.stock === 'number' ? p.stock : Number(p.stock || 0)) - (cartItem.qty || 1);
        return { ...p, stock: Math.max(0, newStock) };
      });
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      // notify in-page listeners
  try { window.dispatchEvent(new Event('products_updated')); } catch { /* ignore */ }
    } catch (err) { console.debug('failed updating product stock', err); }

    // store booking as well if any item is session-based (optional)

  // clear cart
  writeCart([]);
  setItems([]);
    alert('Order placed: ' + orderId);
    navigate('/admin#orders');
  }

  const total = items.reduce((s,i)=> s + (i.price||0) * (i.qty||1), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
        {items.length===0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty. <Link to="/shop.html" className="text-rose-600">Browse products</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(it=> (
                <div key={it.id} className="flex items-center gap-4 border-b pb-3">
                  <img src={it.image} alt="" className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-sm text-gray-500">₹{it.price}</div>
                  </div>
                  <div>
                    <input type="number" min="1" value={it.qty||1} onChange={(e)=> updateQty(it.id, Number(e.target.value))} className="w-20 p-1 border rounded" />
                  </div>
                  <div className="w-24 text-right">₹{((it.price||0)*(it.qty||1)).toFixed(2)}</div>
                  <button onClick={()=>remove(it.id)} className="text-red-600 ml-4">Remove</button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">₹{total.toFixed(2)}</div>
              </div>
              <div className="w-1/3">
                <input value={customer.name} onChange={(e)=>setCustomer({...customer, name:e.target.value})} placeholder="Name" className="w-full p-2 border rounded mb-2" />
                <input value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded mb-2" />
                <input value={customer.phone} onChange={(e)=>setCustomer({...customer, phone:e.target.value})} placeholder="Phone" className="w-full p-2 border rounded mb-2" />
                <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Address" className="w-full p-2 border rounded mb-2" />
                <button onClick={checkout} className="w-full bg-rose-600 text-white py-2 rounded">Place Order</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
