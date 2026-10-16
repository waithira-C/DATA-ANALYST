-- =============================================================================
-- DataLadder seed data
-- Runs automatically after migrations on `supabase db reset` (see config.toml).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- required_steps
-- Placeholder: certificates cannot be issued until this table lists the app's
-- step ids. Generate the real list from app content (see supabase/README.md),
-- e.g.:
--   insert into public.required_steps (step_id) values ('f1-s1'), ('f1-s2'), ...
--   on conflict do nothing;
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- Final exam question bank (answer = zero-based index into options)
-- -----------------------------------------------------------------------------
truncate table public.exam_questions restart identity cascade;

insert into public.exam_questions (q, options, answer, explain, skill) values

-- ---------------------------------------------------------------- spreadsheets
($$Column A holds quarter labels and column C holds revenue. Which formula returns the revenue for "Q3" using an exact match?$$,
 array[$$=VLOOKUP("Q3",A:C,3,FALSE)$$, $$=VLOOKUP("Q3",A:C,3,TRUE)$$, $$=HLOOKUP("Q3",A:C,3,FALSE)$$, $$=INDEX(A:C,3,"Q3")$$],
 0, $$The 4th argument FALSE forces an exact match. TRUE performs an approximate match and assumes the first column is sorted, which can silently return the wrong row.$$, 'spreadsheets'),

($$Cell D2 contains =B2*$C$1. You copy it down to D3. What does D3 contain?$$,
 array[$$=B2*$C$1$$, $$=B3*$C$2$$, $$=B3*$C$1$$, $$=B3*C2$$],
 2, $$Relative references (B2) shift when copied, while absolute references ($C$1) stay locked. So B2 becomes B3 and $C$1 is unchanged.$$, 'spreadsheets'),

($$Which formula counts the cells in A2:A100 whose value is greater than 500?$$,
 array[$$=COUNT(A2:A100>500)$$, $$=COUNTIF(A2:A100,">500")$$, $$=SUMIF(A2:A100,">500")$$, $$=COUNTA(A2:A100,">500")$$],
 1, $$COUNTIF(range, criteria) counts cells meeting one condition. SUMIF would add the values instead of counting them.$$, 'spreadsheets'),

($$Which formula sums Sales (column C) only where Region (column B) is "West" AND Month (column A) is "Jan"?$$,
 array[$$=SUMIF(C:C,B:B,"West",A:A,"Jan")$$, $$=SUM(C:C,"West","Jan")$$, $$=COUNTIFS(C:C,B:B,"West",A:A,"Jan")$$, $$=SUMIFS(C:C,B:B,"West",A:A,"Jan")$$],
 3, $$SUMIFS takes the sum range first, then any number of criteria_range/criteria pairs, all of which must be true.$$, 'spreadsheets'),

($$What does =IFERROR(A2/B2, 0) return when B2 is 0?$$,
 array[$$#DIV/0!$$, $$0$$, $$An empty cell$$, $$The value of A2$$],
 1, $$Dividing by zero produces #DIV/0!, which IFERROR catches and replaces with the fallback value, 0.$$, 'spreadsheets'),

($$What is the main advantage of XLOOKUP over VLOOKUP?$$,
 array[$$It runs macros automatically$$, $$It only works on sorted data$$, $$It can return values from a column to the left of the lookup column and defaults to exact match$$, $$It can only search horizontally$$],
 2, $$XLOOKUP takes separate lookup and return arrays, so the return column can be anywhere, and it defaults to an exact match, avoiding a classic VLOOKUP bug.$$, 'spreadsheets'),

($$Which best describes a PivotTable?$$,
 array[$$A chart that rotates data 90 degrees$$, $$A tool that groups and aggregates rows (sum, count, average) by chosen fields without changing the source data$$, $$A function that looks up a value in another sheet$$, $$A macro that deletes duplicate rows$$],
 1, $$PivotTables summarize a table by grouping on row/column fields and aggregating value fields; the source data is left untouched.$$, 'spreadsheets'),

($$Cell A2 contains "  New   York ". What does =TRIM(A2) return?$$,
 array[$$"NewYork"$$, $$"  New   York "$$, $$"New   York"$$, $$"New York"$$],
 3, $$TRIM removes leading and trailing spaces and collapses repeated internal spaces to a single space.$$, 'spreadsheets'),

($$In Excel, A1 = 2026-03-10 and B1 = 2026-03-01 (both real dates). What does =A1-B1 return?$$,
 array[$$9$$, $$An error, because dates cannot be subtracted$$, $$"9 days" as text$$, $$0.09$$],
 0, $$Excel stores dates as serial day numbers, so subtracting two dates returns the number of days between them.$$, 'spreadsheets'),

($$You want users to pick a Region only from a fixed dropdown list. Which feature should you use?$$,
 array[$$Conditional Formatting$$, $$Data Validation (List)$$, $$Freeze Panes$$, $$Text to Columns$$],
 1, $$Data Validation restricts what can be entered into a cell; the List option creates a dropdown of allowed values.$$, 'spreadsheets'),

-- ------------------------------------------------------------------ statistics
($$Order values are 2, 3, 3, 5 and 100. Which measure best represents a typical order?$$,
 array[$$Mean$$, $$Range$$, $$Median$$, $$Standard deviation$$],
 2, $$The outlier 100 drags the mean up to 22.6, while the median (3) is robust to outliers and reflects the typical value.$$, 'statistics'),

($$What is the mean of 4, 8, 6 and 2?$$,
 array[$$4$$, $$5$$, $$6$$, $$20$$],
 1, $$Sum = 20, count = 4, so the mean is 20 / 4 = 5.$$, 'statistics'),

($$A test returns p = 0.03 with a significance level of 0.05. What is the correct interpretation?$$,
 array[$$There is a 3% chance the null hypothesis is true$$, $$There is a 97% chance the alternative hypothesis is true$$, $$The effect size is 3%$$, $$If the null hypothesis were true, results at least this extreme would occur about 3% of the time, so we reject the null at the 5% level$$],
 3, $$A p-value is the probability of data at least this extreme assuming the null is true. It is not the probability that the null is true.$$, 'statistics'),

($$A correlation coefficient of r = -0.85 between price and units sold indicates:$$,
 array[$$A strong negative linear relationship$$, $$A weak negative relationship$$, $$That higher prices cause lower sales$$, $$No relationship$$],
 0, $$|r| close to 1 means a strong linear relationship; the negative sign means one tends to fall as the other rises. Correlation alone does not prove causation.$$, 'statistics'),

($$Ice cream sales and drowning incidents are positively correlated. What is the most likely explanation?$$,
 array[$$Ice cream causes drowning$$, $$Drowning causes ice cream sales$$, $$A confounding variable (hot weather) drives both$$, $$The correlation must be a data error$$],
 2, $$Hot weather increases both swimming and ice cream consumption. A third variable that affects both is called a confounder.$$, 'statistics'),

($$In a normal distribution, roughly what share of values lies within 2 standard deviations of the mean?$$,
 array[$$50%$$, $$68%$$, $$95%$$, $$99.9%$$],
 2, $$The 68-95-99.7 rule: about 68% within 1 SD, 95% within 2 SD and 99.7% within 3 SD.$$, 'statistics'),

($$What does standard deviation measure?$$,
 array[$$How spread out values are around the mean$$, $$The most common value$$, $$The middle value$$, $$The difference between the max and min$$],
 0, $$Standard deviation is the typical distance of observations from the mean. The max-min difference is the range.$$, 'statistics'),

($$What is a Type I error?$$,
 array[$$Failing to reject a false null hypothesis$$, $$Rejecting a null hypothesis that is actually true (a false positive)$$, $$Using the wrong statistical test$$, $$A data-entry mistake$$],
 1, $$Type I = false positive (rejecting a true null). Type II = false negative (missing a real effect).$$, 'statistics'),

($$Holding everything else constant, what happens to a 95% confidence interval when the sample size increases?$$,
 array[$$It gets wider$$, $$It stays the same$$, $$It becomes a 99% interval$$, $$It gets narrower$$],
 3, $$The standard error shrinks roughly with 1/sqrt(n), so larger samples give more precise (narrower) intervals.$$, 'statistics'),

($$Household income is strongly right-skewed. How do the mean and median typically compare?$$,
 array[$$Mean > median$$, $$Mean < median$$, $$Mean = median$$, $$They cannot be compared$$],
 0, $$A long right tail of very high values pulls the mean above the median, which is why median income is usually reported.$$, 'statistics'),

-- ------------------------------------------------------------------------- SQL
($$Which clause filters groups AFTER aggregation, e.g. keeping only customers with more than 5 orders?$$,
 array[$$WHERE$$, $$HAVING$$, $$ORDER BY$$, $$LIMIT$$],
 1, $$WHERE filters individual rows before GROUP BY; HAVING filters the grouped results, so it can reference aggregates like COUNT(*) > 5.$$, 'sql'),

($$customers LEFT JOIN orders ON customers.id = orders.customer_id returns:$$,
 array[$$Only customers who have orders$$, $$Only orders without customers$$, $$Every customer, with NULL order columns for customers who have no orders$$, $$Every combination of customer and order$$],
 2, $$A LEFT JOIN keeps all rows from the left table; where there is no match, the right-side columns are NULL. Every combination would be a CROSS JOIN.$$, 'sql'),

($$Which query finds customers who have never placed an order?$$,
 array[$$SELECT c.* FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL$$, $$SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id = NULL$$, $$SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NOT NULL$$, $$SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL$$],
 3, $$The LEFT JOIN keeps unmatched customers with NULL order columns, and IS NULL selects them. "= NULL" never evaluates to true, and an INNER JOIN drops unmatched customers entirely.$$, 'sql'),

($$A column email has 100 rows, 12 of which are NULL. What do COUNT(*) and COUNT(email) return?$$,
 array[$$100 and 88$$, $$88 and 100$$, $$100 and 100$$, $$88 and 88$$],
 0, $$COUNT(*) counts rows; COUNT(column) counts only non-NULL values of that column.$$, 'sql'),

($$Table A has 3 rows. Each of them matches exactly 2 rows in table B on the join key. How many rows does A INNER JOIN B return?$$,
 array[$$3$$, $$2$$, $$6$$, $$5$$],
 2, $$Each A row is paired with every matching B row: 3 x 2 = 6. Unexpected row multiplication is a classic join pitfall.$$, 'sql'),

($$Why does SELECT * FROM users WHERE phone = NULL return no rows even when some phones are missing?$$,
 array[$$NULL is stored as the text 'NULL'$$, $$Comparing with = NULL yields UNKNOWN, never TRUE; you must use IS NULL$$, $$The WHERE clause ignores NULL columns$$, $$Phone must be cast to text first$$],
 1, $$NULL means unknown, so any comparison with = returns UNKNOWN, which WHERE treats as false. Use IS NULL / IS NOT NULL.$$, 'sql'),

($$Salaries are 100, 90, 90, 80. Using DENSE_RANK() OVER (ORDER BY salary DESC), what rank does 80 get?$$,
 array[$$2$$, $$4$$, $$1$$, $$3$$],
 3, $$DENSE_RANK gives ties the same rank and does not skip: 1, 2, 2, 3. RANK would give 1, 2, 2, 4, and ROW_NUMBER 1, 2, 3, 4.$$, 'sql'),

($$Which expression produces a running total of amount ordered by order_date?$$,
 array[$$SUM(amount) OVER (ORDER BY order_date)$$, $$SUM(amount) GROUP BY order_date$$, $$RUNNING_SUM(amount)$$, $$COUNT(amount) OVER (PARTITION BY order_date)$$],
 0, $$A window SUM with ORDER BY accumulates from the first row up to the current row, giving a cumulative total while keeping every row.$$, 'sql'),

($$You need the single largest order for each customer. Which approach is correct?$$,
 array[$$SELECT * FROM orders WHERE ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) = 1$$, $$Compute ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn in a CTE or subquery, then filter WHERE rn = 1 in the outer query$$, $$SELECT customer_id, MAX(*) FROM orders$$, $$SELECT DISTINCT customer_id, amount FROM orders ORDER BY amount DESC$$],
 1, $$Window functions are evaluated after WHERE, so they cannot be filtered in the same query level. Number the rows per customer in a CTE/subquery and filter outside.$$, 'sql'),

($$What does LAG(revenue) OVER (ORDER BY month) return for each row?$$,
 array[$$The next month's revenue$$, $$The total revenue to date$$, $$The previous month's revenue (NULL for the first row)$$, $$The average revenue$$],
 2, $$LAG looks back one row in the window order; LEAD looks forward. It is the standard way to compute month-over-month change.$$, 'sql'),

($$What is the key difference between a window function and GROUP BY aggregation?$$,
 array[$$Window functions only work on numbers$$, $$GROUP BY is faster in all cases$$, $$There is no difference$$, $$A window function computes across related rows but keeps every individual row, while GROUP BY collapses rows into one per group$$],
 3, $$e.g. AVG(salary) OVER (PARTITION BY dept) shows each employee alongside their department average; GROUP BY dept would return one row per department.$$, 'sql'),

($$What is the difference between UNION and UNION ALL?$$,
 array[$$UNION removes duplicate rows; UNION ALL keeps all rows (and is usually faster)$$, $$UNION ALL removes duplicates; UNION keeps them$$, $$UNION joins tables side by side$$, $$UNION ALL requires the same table name$$],
 0, $$Both stack result sets vertically. UNION adds a de-duplication step; use UNION ALL when duplicates are impossible or wanted.$$, 'sql'),

($$What does a WITH clause (Common Table Expression) do?$$,
 array[$$Creates a permanent table$$, $$Defines a named, temporary result set that the rest of the query can reference$$, $$Adds an index$$, $$Locks the table for writing$$],
 1, $$A CTE exists only for that statement. It makes multi-step logic readable, like naming intermediate steps.$$, 'sql'),

($$SELECT department, AVG(salary) FROM employees; raises an error. What fixes it?$$,
 array[$$Add ORDER BY department$$, $$Replace AVG with SUM$$, $$Add GROUP BY department$$, $$Add WHERE salary IS NOT NULL$$],
 2, $$Any non-aggregated column in the SELECT list must appear in GROUP BY so the database knows how to form groups.$$, 'sql'),

($$In which logical order does a database evaluate these clauses?$$,
 array[$$SELECT, FROM, WHERE, GROUP BY$$, $$FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY$$, $$WHERE, FROM, SELECT, HAVING$$, $$SELECT, ORDER BY, FROM, WHERE$$],
 1, $$Rows come FROM tables, are filtered by WHERE, grouped, filtered again by HAVING, projected by SELECT and finally sorted. That is why a SELECT alias usually can't be used in WHERE.$$, 'sql'),

-- --------------------------------------------------------------- visualization
($$You need to show how monthly revenue changed over the last 24 months. Which chart fits best?$$,
 array[$$Pie chart$$, $$Line chart$$, $$Scatter plot$$, $$Treemap$$],
 1, $$Line charts emphasize change over a continuous ordered axis such as time.$$, 'visualization'),

($$You want to compare total sales across 12 product categories. Which chart is clearest?$$,
 array[$$A bar chart sorted by value$$, $$A 12-slice pie chart$$, $$A line chart$$, $$A 3D donut chart$$],
 0, $$Bars on a common baseline make length comparisons easy, and sorting makes the ranking obvious. Pies with many slices are hard to compare.$$, 'visualization'),

($$Which chart best shows the relationship between advertising spend and sales for 200 stores?$$,
 array[$$Stacked bar chart$$, $$Histogram$$, $$Scatter plot$$, $$Pie chart$$],
 2, $$A scatter plot places each store at (spend, sales), revealing correlation, clusters and outliers between two numeric variables.$$, 'visualization'),

($$Which chart best shows the distribution of delivery times (one numeric variable)?$$,
 array[$$Line chart$$, $$Pie chart$$, $$Scatter plot$$, $$Histogram$$],
 3, $$A histogram bins a numeric variable and shows how frequently values fall in each bin, revealing shape, skew and outliers.$$, 'visualization'),

($$Why should the value axis of a bar chart start at zero?$$,
 array[$$Bar length encodes the value, so a truncated axis exaggerates differences$$, $$Software requires it$$, $$It makes the chart more colorful$$, $$Zero is always the average$$],
 0, $$Readers compare bar lengths. Starting at, say, 95 makes a 2% difference look several times larger. Line charts can use a non-zero baseline more safely.$$, 'visualization'),

($$Why are pie charts with many slices usually a poor choice?$$,
 array[$$They cannot show percentages$$, $$People compare angles and areas much less accurately than lengths on a common scale$$, $$They require time-series data$$, $$They only work in Excel$$],
 1, $$Perception research shows position and length are judged more accurately than angle and area, so bars communicate comparisons better.$$, 'visualization'),

($$Which practice makes a chart more accessible to colorblind viewers?$$,
 array[$$Encoding good/bad only with red vs green$$, $$Using as many colors as possible$$, $$Using a colorblind-safe palette plus direct labels or patterns so color is not the only cue$$, $$Removing the legend$$],
 2, $$Red-green color vision deficiency is common. Pair color with labels, position or shape so meaning survives without color.$$, 'visualization'),

($$In a chart of 10 regions, you want the audience to notice that one region is underperforming. What is the most effective technique?$$,
 array[$$Give each region a different bright color$$, $$Add a 3D effect$$, $$Add more gridlines$$, $$Color the one region in an accent color and the others in muted gray, with a short annotation$$],
 3, $$Contrast is pre-attentive: a single highlight color against neutral gray directs attention instantly; an annotation explains why it matters.$$, 'visualization'),

-- --------------------------------------------------------------- Python/pandas
($$What does df.groupby('region')['sales'].sum() return?$$,
 array[$$A Series of total sales indexed by region$$, $$The total of all sales as a single number$$, $$The original DataFrame sorted by region$$, $$A list of region names$$],
 0, $$groupby splits rows by region, selects the sales column and sums each group, returning a Series whose index is the region values.$$, 'pandas'),

($$Which expression selects rows where sales > 100 AND region is 'West'?$$,
 array[$$df[df['sales'] > 100 and df['region'] == 'West']$$, $$df[(df['sales'] > 100) & (df['region'] == 'West')]$$, $$df[df['sales'] > 100 & df['region'] == 'West']$$, $$df.where('sales > 100', 'West')$$],
 1, $$pandas uses the element-wise & operator, and each condition needs parentheses because & binds tighter than comparisons. Python's "and" raises an ambiguous-truth-value error on a Series.$$, 'pandas'),

($$What does df.isna().sum() return?$$,
 array[$$The total of all numeric values$$, $$The number of rows$$, $$The number of missing values in each column$$, $$A DataFrame with missing rows removed$$],
 2, $$isna() produces a True/False frame; summing booleans counts the Trues per column, a standard first data-quality check.$$, 'pandas'),

($$pd.merge(orders, customers, on='customer_id', how='left') keeps:$$,
 array[$$Only rows with a match in both tables$$, $$All rows from customers$$, $$Only unmatched rows$$, $$All rows from orders, with NaN for customer columns where there is no match$$],
 3, $$how='left' mirrors a SQL LEFT JOIN: every row from the left DataFrame (orders) is kept.$$, 'pandas'),

($$Why run df['order_date'] = pd.to_datetime(df['order_date'])?$$,
 array[$$To convert text dates into datetime values so you can sort, filter by date ranges and extract parts like month$$, $$To delete invalid dates$$, $$To format dates as strings for export$$, $$To set the column as the index$$],
 0, $$Dates read from CSV are usually strings. Converting enables .dt accessors (e.g. .dt.month), resampling and correct chronological sorting.$$, 'pandas'),

($$What is the difference between df.loc and df.iloc?$$,
 array[$$loc is faster; iloc is slower$$, $$loc selects by labels (index/column names); iloc selects by integer position$$, $$loc is for rows only; iloc is for columns only$$, $$There is no difference$$],
 1, $$df.loc['2026-01', 'sales'] uses labels; df.iloc[0, 2] uses zero-based positions.$$, 'pandas'),

($$What does df['age'] = df['age'].fillna(df['age'].median()) do?$$,
 array[$$Drops rows with missing age$$, $$Replaces every age with the median$$, $$Replaces missing ages with the median age$$, $$Counts missing ages$$],
 2, $$fillna imputes only the missing values. The median is a common choice because it is robust to outliers.$$, 'pandas'),

($$What does df['city'].value_counts() return?$$,
 array[$$The number of columns$$, $$The unique cities in alphabetical order$$, $$The sum of the city column$$, $$How many times each city appears, sorted from most to least frequent$$],
 3, $$value_counts() is a quick frequency table; add normalize=True to get proportions.$$, 'pandas'),

($$What does df.drop_duplicates(subset=['email']) do?$$,
 array[$$Keeps the first row for each email and removes later rows with the same email$$, $$Removes the email column$$, $$Removes all rows that have an email$$, $$Returns only duplicated rows$$],
 0, $$subset restricts the duplicate check to the listed columns; by default keep='first'. Remember to assign the result or it is discarded.$$, 'pandas'),

($$What is the result of [x * 2 for x in range(3)] in Python?$$,
 array[$$[2, 4, 6]$$, $$[0, 2, 4]$$, $$[0, 1, 2]$$, $$6$$],
 1, $$range(3) yields 0, 1, 2; doubling each gives [0, 2, 4].$$, 'python'),

-- ------------------------------------------------- business & A/B testing
($$Why are users randomly assigned to variants in an A/B test?$$,
 array[$$To make the test finish faster$$, $$So each variant gets the most engaged users$$, $$So other factors are balanced on average, and differences can be attributed to the change being tested$$, $$Randomization is optional if the sample is large$$],
 2, $$Randomization breaks the link between user characteristics and the variant, which is what allows causal conclusions.$$, 'ab-testing'),

($$A landing page had 1,000 visitors and 50 purchases. What is the conversion rate?$$,
 array[$$0.5%$$, $$50%$$, $$20%$$, $$5%$$],
 3, $$Conversion rate = conversions / visitors = 50 / 1,000 = 0.05 = 5%.$$, 'business'),

($$Revenue grew from $200k to $250k. What is the percentage increase?$$,
 array[$$25%$$, $$20%$$, $$50%$$, $$80%$$],
 0, $$(250 - 200) / 200 = 0.25 = 25%. Dividing by the new value (giving 20%) is a common mistake.$$, 'business'),

($$Conversion rose from 4% to 5%. Which statement is correct?$$,
 array[$$It rose by 1% relative$$, $$It rose by 1 percentage point, a 25% relative increase$$, $$It rose by 25 percentage points$$, $$It rose by 5%$$],
 1, $$The absolute change is 5 - 4 = 1 percentage point; relative change is 1 / 4 = 25%. Always say which one you mean.$$, 'business'),

($$An analyst checks an A/B test daily and stops it the first day p < 0.05. What is the main problem?$$,
 array[$$Nothing, this is best practice$$, $$It makes the test underpowered for revenue$$, $$Repeated peeking inflates the false-positive rate well above 5%$$, $$It biases the randomization$$],
 2, $$Each look is another chance for noise to cross the threshold. Fix the sample size in advance or use a sequential testing method.$$, 'ab-testing'),

($$Why should the primary metric of an experiment be chosen before the test starts?$$,
 array[$$To prevent cherry-picking whichever metric happens to look significant afterwards$$, $$Because metrics cannot be calculated later$$, $$So the test needs fewer users$$, $$It is required by spreadsheet software$$],
 0, $$Testing many metrics after the fact multiplies the chance of a false positive (p-hacking). Pre-registering the metric keeps the decision honest.$$, 'ab-testing'),

($$A subscription business starts the month with 500 customers and loses 25 of them during the month. What is the monthly churn rate?$$,
 array[$$25%$$, $$2.5%$$, $$95%$$, $$5%$$],
 3, $$Churn = customers lost / customers at start = 25 / 500 = 5%.$$, 'business'),

($$A test shows a statistically significant +0.1% lift in conversion, but the change costs a lot to build and maintain. What should the analyst highlight?$$,
 array[$$Significance proves it should be shipped$$, $$Statistical significance is not the same as practical significance; weigh the effect size against cost$$, $$The result must be wrong$$, $$Re-run until the lift is bigger$$],
 1, $$With large samples tiny effects become significant. Decisions need the effect size, its confidence interval and the business cost/benefit.$$, 'business'),

($$A manager asks, "Why did sales drop last month?" What should you do first?$$,
 array[$$Build a dashboard with every available metric$$, $$Start a machine learning model$$, $$Clarify the question: which sales metric, which segment and time frame, compared to what, and confirm the data is complete$$, $$Report that sales are seasonal$$],
 2, $$Scoping the question and checking data quality (e.g. a late data load) prevents hours of analysis answering the wrong question.$$, 'business'),

($$What is the main purpose of a funnel analysis (visit -> sign-up -> trial -> purchase)?$$,
 array[$$To find the step where the largest share of users drops off$$, $$To calculate total revenue$$, $$To forecast next year's sales$$, $$To measure server response time$$],
 0, $$Step-to-step conversion rates show where users are lost, pointing to where improvements will have the most impact.$$, 'business');
