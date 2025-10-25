"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import HistoryModal from "./components/HistoryModal";
import Flag from "./components/Flag"; 
import { TARGETS, formatMoney } from "./lib/utils";

type Rates = Record<string, number>;
const BASE_DEFAULT = "AUD";

function convert(amount: number, from: string, to: string, rates: Rates | null) {
  if (!rates) return 0;
  const usdToFrom = rates[from];
  const usdToTo = rates[to];
  if (!usdToFrom || !usdToTo) return 0;
  return amount * (usdToTo / usdToFrom);
}

export default function Home() {
  const [amount, setAmount] = useState<number>(1000);
  const [rates, setRates] = useState<Rates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState<string>(BASE_DEFAULT);
  const [to, setTo] = useState<string>(TARGETS[1]);
  const [showInverse, setShowInverse] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/rates?type=latest");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch rates");
        setRates(json.rates);
      } catch (err: any) {
        setError(err.message || "Failed to fetch rates");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const liveRate = useMemo(() => {
    if (!rates) return null;
    const usdToFrom = rates[from];
    const usdToTo = rates[to];
    if (!usdToFrom || !usdToTo) return null;
    return usdToTo / usdToFrom;
  }, [rates, from, to]);

  const converted = useMemo(() => {
    if (!liveRate) return 0;
    return amount * liveRate;
  }, [amount, liveRate]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };
  const quickList = useMemo(() => TARGETS.filter((c) => c !== from), [from]);

  async function showHistory(code: string) {
    setSelectedCode(code);
    setModalOpen(true);

    try {
      const days = Array.from({ length: 14 }, (_, i) =>
        dayjs().subtract(i, "day").format("YYYY-MM-DD")
      ).reverse();

      const responses = await Promise.all(
        days.map((d) =>
          fetch(`/api/rates?type=historical&date=${d}`).then((r) => r.json())
        )
      );

      const points = responses.map((r: any) => {
        const rFrom = r.rates?.[from];
        const rTo = r.rates?.[code];
        return rFrom && rTo ? rTo / rFrom : null;
      });

      setChartLabels(days.map((d) => dayjs(d).format("DD MMM")));
      setChartData(points.filter((p): p is number => p !== null));
    } catch (e) {
      console.error(e);
    }
  }

  function countDigits(number: number): number {
    const numStr = Math.abs(number).toString();
    return numStr.replace('.', '').replace(',', '').length;
  }

  return (
    <main className="shell">
      <section className="mainView">
        <h1 className="headerText">Currency Converter</h1>

        <div className="block">
          <div className="ccy-line">
            <Flag code={from} />
            <select
              className="select"
              value={from}
              aria-label="From currency"
              onChange={(e) => setFrom(e.target.value)}
            >
              {[...new Set([from, ...TARGETS])].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="amount" data-digits={countDigits(amount)}>
            <input
              inputMode="decimal"
              value={Number.isNaN(amount) ? "" : amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              aria-label="Amount"
            />
          </div>
        </div>

        <div className="swap-row">
          <button className="swap-btn" onClick={swap} title="Swap currencies">
            ⇅
          </button>
          <div
            className="rate-pill"
            role="button"
            tabIndex={0}
            onClick={() => setShowInverse((s) => !s)}
            onKeyDown={(e) => e.key === "Enter" && setShowInverse((s) => !s)}
            title="Toggle inverse rate"
          >
            {loading && "Fetching rate…"}
            {!loading && !liveRate && "Rate unavailable"}
            {!loading && liveRate && !showInverse && (
              <>1 {from} = {liveRate.toFixed(4)} {to}</>
            )}
            {!loading && liveRate && showInverse && (
              <>1 {to} = {(1 / liveRate).toFixed(4)} {from}</>
            )}
          </div>
        </div>

        <div className="block">
          <div className="ccy-line">
            <Flag code={to} />
            <select
              className="select"
              value={to}
              aria-label="To currency"
              onChange={(e) => setTo(e.target.value)}
            >
              {[...new Set([to, ...TARGETS])].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="amount" aria-live="polite" data-digits={countDigits(amount)}>
            {loading ? "…" : formatMoney(converted, to)}
          </div>
        </div>

        {rates && (
          <div className="quick">
            <div className="quick-title">Quick view (tap for 14-day chart)</div>
            <div className="table-container">
              <table className="tbl">
                <tbody>
                  {quickList.map((code) => {
                    const value = convert(amount, from, code, rates);
                    return (
                      <tr key={code} onClick={() => showHistory(code)}>
                        <td className="left">
                          <Flag code={code} />
                          {code}
                        </td>
                        <td className="right">{formatMoney(value, code)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && <div className="err">{error}</div>}
      </section>

      <HistoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        code={selectedCode}
        labels={chartLabels}
        data={chartData}
        from={from}
      />
    </main>
  );
}