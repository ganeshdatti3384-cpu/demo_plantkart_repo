import React, { useState } from 'react';

export default function PartnerDiscountForm() {
  const [form, setForm] = useState({
    partnerId: '',
    code: '',
  });
  const [discount, setDiscount] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    setDiscount(null);
    const res = await fetch(`/api/partners/${form.partnerId}/discount`);
    if (res.ok) {
      const data = await res.json();
      setDiscount(data.discount);
      setStatus('Discount fetched!');
    } else {
      setStatus('Error fetching discount.');
    }
  };

  return (
    <form className="max-w-md mx-auto p-6 bg-white dark:bg-dark rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Partner Discount</h2>
      <label className="block mb-2">Partner ID
        <input name="partnerId" value={form.partnerId} onChange={handleChange} className="w-full p-2 border rounded" required />
      </label>
      <label className="block mb-2">Code / Booking Reference
        <input name="code" value={form.code} onChange={handleChange} className="w-full p-2 border rounded" />
      </label>
      <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white rounded font-semibold">Get Discount</button>
      {discount !== null && <p className="mt-4 text-center text-blue-600">Discount: {discount}%</p>}
      {status && <p className="mt-2 text-center text-green-600">{status}</p>}
    </form>
  );
}
