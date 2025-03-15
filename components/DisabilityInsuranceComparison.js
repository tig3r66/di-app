import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/outline';

// Helper function for a styled card with hover effect
function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-400 transition-transform duration-50 ease-in-out hover:shadow-lg">
      <div className="flex items-center mb-4">
        {icon && <span className="mr-3 text-blue-500">{icon}</span>}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DisabilityInsuranceComparison() {
  const [stepwiseBrackets, setStepwiseBrackets] = useState([
    { minAge: 25, maxAge: 29, monthlyPremium: 50.0 },
    { minAge: 30, maxAge: 34, monthlyPremium: 68.74 },
    { minAge: 35, maxAge: 39, monthlyPremium: 90.13 },
    { minAge: 40, maxAge: 44, monthlyPremium: 110.05 },
    { minAge: 45, maxAge: 49, monthlyPremium: 136.62 },
    { minAge: 50, maxAge: 54, monthlyPremium: 164.22 },
    { minAge: 55, maxAge: 59, monthlyPremium: 189.54 },
    { minAge: 60, maxAge: 64, monthlyPremium: 210.44 },
    { minAge: 65, maxAge: 69, monthlyPremium: 154.55 },
  ]);

  const [flatMonthlyPremium, setFlatMonthlyPremium] = useState(100.0);
  const [startAge, setStartAge] = useState(25);
  const [endAge, setEndAge] = useState(65);

  const getStepwisePremium = (age) => {
    for (const bracket of stepwiseBrackets) {
      if (age >= bracket.minAge && age <= bracket.maxAge) {
        return bracket.monthlyPremium;
      }
    }
    return 0;
  };

  const chartData = useMemo(() => {
    let cumulativeStepwise = 0;
    let cumulativeFlat = 0;
    const data = [];
    for (let age = startAge; age <= endAge; age++) {
      cumulativeStepwise += getStepwisePremium(age) * 12;
      cumulativeFlat += flatMonthlyPremium * 12;
      data.push({
        age,
        stepwise: +cumulativeStepwise.toFixed(2),
        flat: +cumulativeFlat.toFixed(2),
      });
    }
    return data;
  }, [startAge, endAge, stepwiseBrackets, flatMonthlyPremium]);

  const breakeven = useMemo(() => {
    let beAge = null;
    for (let i = 1; i < chartData.length; i++) {
      const prev = chartData[i - 1];
      const curr = chartData[i];
      const prevDiff = prev.stepwise - prev.flat;
      const currDiff = curr.stepwise - curr.flat;

      if (prevDiff === 0) {
        beAge = prev.age;
        break;
      } else if (currDiff === 0) {
        beAge = curr.age;
        break;
      } else if (prevDiff * currDiff < 0) {
        const diffRatio = Math.abs(prevDiff) / (Math.abs(prevDiff) + Math.abs(currDiff));
        beAge = prev.age + diffRatio * (curr.age - prev.age);
        break;
      }
    }
    return beAge;
  }, [chartData]);

  let cheaperPlan = "";
  if (chartData.length > 0) {
    const lastPoint = chartData[chartData.length - 1];
    if (lastPoint.stepwise < lastPoint.flat) {
      cheaperPlan = "Stepwise plan is cheaper by the end age.";
    } else if (lastPoint.stepwise > lastPoint.flat) {
      cheaperPlan = "Flat-rate plan is cheaper by the end age.";
    } else {
      cheaperPlan = "They are exactly the same at the end age.";
    }
  }

  return (
    <div>
      <div className="bg-gray-100 p-4 md:p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Disability Insurance for Resident Physicians
        </h1>
        <p className="text-gray-700 text-center mb-8">
          Choosing the right disability insurance is crucial as you transition to residency. This tool compares stepwise and flat-rate plans and explains key features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card title="Key Concepts" icon={<DocumentTextIcon className="h-6 w-6" />}>
            <ul className="list-disc ml-6 text-gray-700">
              <li><strong>Premium:</strong> The monthly cost of insurance.</li>
              <li><strong>Benefit:</strong> Payout if you become disabled.</li>
              <li><strong>Elimination Period:</strong> Waiting period before benefits start.</li>
              <li><strong>Benefit Period:</strong> How long benefits are paid.</li>
            </ul>
          </Card>

          <Card title="Policy Features" icon={<ShieldCheckIcon className="h-6 w-6" />}>
            <ul className="list-disc ml-6 text-gray-700">
              <li><strong>Own Occupation:</strong> Critical for physicians. You&apos;re disabled if you can&apos;t work in <em>your</em> specialty.</li>
              <li><strong>Partial Disability:</strong> Pays if you can work, but with reduced income.</li>
              <li><strong>COLA:</strong> Increases your benefit with inflation.</li>
              <li><strong>FIO/GIB:</strong> Lets you increase coverage later without more medical checks.</li>
              <li><strong>Non-Cancellable/Guaranteed Renewable:</strong> Policy can&apos;t be canceled or premiums raised.</li>
              <li><strong>International Coverage:</strong> Covers you if disabled outside of Canada.</li>
              <li><strong>Waiver of Premium:</strong> Premiums waived while receiving benefits.</li>
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card title="Group Plans" icon={<UserGroupIcon className="h-6 w-6" />}>
            <p className="text-gray-700 mb-2">Typically through a medical association.</p>
            <ul className="list-disc ml-6 text-gray-700">
              <li><strong>Pros:</strong> Lower initial premiums, simplified underwriting.</li>
              <li><strong>Cons:</strong> Premiums can increase, less comprehensive coverage, may not be portable, benefits may be taxable.</li>
            </ul>
          </Card>

          <Card title="Individual Plans" icon={<CurrencyDollarIcon className="h-6 w-6" />}>
            <p className="text-gray-700 mb-2">Purchased directly from an insurance provider.</p>
            <ul className="list-disc ml-6 text-gray-700">
              <li><strong>Pros:</strong> Locked-in premiums, comprehensive coverage, portable, benefits are usually tax-free.</li>
              <li><strong>Cons:</strong> Higher initial premiums, more thorough underwriting.</li>
            </ul>
          </Card>
        </div>

        <Card title="Recommendation" icon={<CheckCircleIcon className="h-6 w-6" />}>
          <p className="text-gray-700">
            For most residents, a strong individual policy with &quot;own occupation,&quot; an FIO, and non-cancellable/guaranteed renewable features is recommended. A group plan can supplement this.
          </p>
        </Card>

        <h2 className="text-2xl font-bold text-center text-gray-800 mt-12 mb-4">
          Disability Insurance Comparison Tool
        </h2>
        <p className="text-gray-700 text-center mb-8">
          Compare cumulative costs of stepwise vs. flat-rate plans. This is a simplified comparison; consult a qualified advisor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Editable Stepwise Brackets */}
          <Card title="Stepwise Brackets" icon={<TrendingUpIcon className="h-6 w-6" />}>
            {stepwiseBrackets.map((bracket, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex space-x-2 mb-1">
                  <input
                    type="number"
                    value={bracket.minAge}
                    onChange={(e) => {
                      const newBrackets = [...stepwiseBrackets];
                      newBrackets[idx].minAge = parseInt(e.target.value) || 0;
                      if (newBrackets[idx].minAge > newBrackets[idx].maxAge) {
                        newBrackets[idx].maxAge = newBrackets[idx].minAge;
                      }
                      setStepwiseBrackets(newBrackets);
                    }}
                    className="border p-1 w-16 rounded"
                  />
                  <span className="self-center">-</span>
                  <input
                    type="number"
                    value={bracket.maxAge}
                    onChange={(e) => {
                      const newBrackets = [...stepwiseBrackets];
                      newBrackets[idx].maxAge = parseInt(e.target.value) || 0;
                      if (newBrackets[idx].maxAge < newBrackets[idx].minAge) {
                        newBrackets[idx].minAge = newBrackets[idx].maxAge;
                      }
                      setStepwiseBrackets(newBrackets);
                    }}
                    className="border p-1 w-16 rounded"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={bracket.monthlyPremium}
                    onChange={(e) => {
                      const newBrackets = [...stepwiseBrackets];
                      newBrackets[idx].monthlyPremium = parseFloat(e.target.value) || 0;
                      setStepwiseBrackets(newBrackets);
                    }}
                    className="border p-1 w-20 rounded"
                  />
                  <span className="self-center text-gray-700">$/month</span>
                </div>
                <div className="text-sm text-gray-600 ml-1">
                  {bracket.minAge} - {bracket.maxAge} years old at ${bracket.monthlyPremium.toFixed(2)} / month
                </div>
              </div>
            ))}
          </Card>

          {/* Flat Plan + Age Range */}
          <Card title="Flat Plan & Age Range" icon={<ClockIcon className="h-6 w-6" />}>
            <label className="block mb-2">
              Flat Monthly Premium:
              <input
                type="number"
                step="0.01"
                value={flatMonthlyPremium}
                onChange={(e) => setFlatMonthlyPremium(parseFloat(e.target.value) || 0)}
                className="border p-1 ml-2 w-24 rounded"
              />
            </label>
            <div className="flex space-x-2">
              <label>
                Start Age:
                <input
                  type="number"
                  value={startAge}
                  onChange={(e) => setStartAge(parseInt(e.target.value) || 0)}
                  className="border p-1 ml-2 w-16 rounded"
                />
              </label>
              <label>
                End Age:
                <input
                  type="number"
                  value={endAge}
                  onChange={(e) => setEndAge(parseInt(e.target.value) || 0)}
                  className="border p-1 ml-2 w-16 rounded"
                />
              </label>
            </div>

            <hr className="my-4 border-gray-300" />

            <h4 className="text-lg font-bold mb-2">Cumulative Premium Comparison</h4>
            <div className="w-full flex justify-center">
              <LineChart width={600} height={300} data={chartData}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stepwise" stroke="#8884d8" name="Stepwise Cumulative" />
                <Line type="monotone" dataKey="flat" stroke="#82ca9d" name="Flat Cumulative" />
                <Legend verticalAlign="bottom" layout="vertical" />
                {breakeven && (
                  <ReferenceLine x={breakeven} stroke="red" label={`Breakeven: ${breakeven.toFixed(2)}`} />
                )}
              </LineChart>
            </div>

            <div className="mt-4 text-center">
              {breakeven ? (
                <p>
                  Breakeven occurs around age <strong>{breakeven.toFixed(2)}</strong>.
                </p>
              ) : (
                <p>No breakeven point within the current age range.</p>
              )}
              <p>{cheaperPlan}</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8">
        &copy; Eddie Guo 2025-{new Date().getFullYear()}
      </div>
    </div>
  );
}

export default DisabilityInsuranceComparison;
