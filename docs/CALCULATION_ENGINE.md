# Lifewise AI - Financial Calculation Engine Specifications

## Core Methodologies

### 1. Net Needs Approach
Total Estimated Needs =
  Present Value of Future Family Support Needs
  + Outstanding Liabilities (Home loan, Personal loan, Car loan, etc.)
  + Future Financial Goals (Children's education, marriage, retirement emergency fund)
  + Other Specified Obligations (End-of-life expenses, immediate medical buffer)

Available Protection =
  Existing Life Insurance Coverage
  + Eligible Available Assets (Liquid savings, emergency funds dedicated to family protection, fixed deposits, excluding locked retirement/pension)

Additional Estimated Life Cover Required =
  max(0, Total Estimated Needs - Available Protection)

#### Present Value Formula for Family Support:
Given:
- Annual living expense required for family: $E$
- Years of support needed until youngest dependent achieves independence / spouse reaches retirement: $T$
- Assumed annual inflation rate: $i$ (Default: 6.0% or 0.06)
- Assumed investment/discount rate on corpus: $r$ (Default: 7.5% or 0.075)
- Real rate of return $k = \frac{r - i}{1 + i}$

If $k \neq 0$:
$$PV = E \times \frac{1 - (1 + k)^{-T}}{k}$$
If $k = 0$:
$$PV = E \times T$$

### 2. Human Life Value (HLV) Approach
Human Life Value calculates the economic present value of an individual's future net earnings that would support dependents over their remaining working lifetime.

Given:
- Current Age: $A$
- Expected Retirement Age: $R$ (Default: 60)
- Years to Retirement: $Y = \max(0, R - A)$
- Annual Income: $I$
- Personal Consumption Percentage: $c$ (Typically 25% to 30%, meaning 70-75% goes to family)
- Net Annual Income for Family: $F = I \times (1 - c)$
- Expected annual income growth rate: $g$ (Default: 5% or 0.05)
- Discount rate: $r$ (Default: 7.5% or 0.075)
- Real discount rate $k_{hlv} = \frac{r - g}{1 + g}$

$$HLV = F \times \frac{1 - (1 + k_{hlv})^{-Y}}{k_{hlv}}$$

HLV is displayed strictly alongside Net Needs as a comparative economic benchmark without double counting.

### 3. Rule-Based Product Matching Engine
Product Categories:
1. **Term Life Insurance (Pure Protection)**
   - High coverage gap (> ₹25 Lakhs)
   - Cost-effective protection priority
   - Low to moderate budget per unit coverage
2. **Whole Life Insurance**
   - Lifelong coverage requirement (up to age 99/100)
   - Wealth transfer / legacy planning preference
   - Higher budget capacity
3. **Endowment Plans (Guaranteed Savings + Cover)**
   - High risk-aversion, low risk tolerance
   - Capital preservation focus with fixed future milestone goals (e.g. child education in 10-15 years)
4. **ULIP (Unit-Linked Insurance Plan)**
   - Dual goal: Market-linked wealth creation + life insurance
   - Higher risk tolerance, medium-to-long investment horizon (> 10-15 years)
   - Tax-saving exempt-exempt-exempt (EEE) under prevailing laws where applicable
