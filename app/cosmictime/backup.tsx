{/* <section>
  <div className="flex flex-col md:flex-row gap-6">
    {/* Sanātana Dharma */}
   {/* <div className="flex-1 bg-white rounded shadow p-4 mb-8">
      <ol>
        {Object.entries(cosmic.option3_scientific_comparison).map(([key, value]) => {
          let obj = {};
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            obj = value;
          }
          return (<li key={key}>
            <strong>{formatKey(key)}: </strong> obj
          </li>);
        })}
      </ol>
    </div>
    {/* Modern Science */}
    {/*<div className="flex-1 bg-white rounded shadow p-4 mb-8">
      <ol>
        {Object.entries(cosmic.option4_manvantara_explainer).map(([key, value]) => {
          let obj = {};
          let arr = [];
          let str = '';
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            obj = value;
          }
          else if (value !== null && Array.isArray(value)) {
            arr = value;
          }
          else {
            str = value + ' ';
          }
          return (<li key={key}>
            <strong>{formatKey(key)}: </strong>
            {str ? str : null}
            {arr.length > 0 && arr.map(item => {
              if (typeof item === 'string') {
                return <div>{item + ', '}</div>;
              }
              if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
                return <div>{item.order + '. ' + item.name + ', '}</div>;
              }
            })}
            <ol>
              {typeof obj === 'object' && !Array.isArray(obj) ? Object.entries(obj).map(([key, value]) =>
                <li key={key}>
                  <span className="description font-semibold!">{formatKey(key)}: </span>{typeof value === 'string' ? value : null}</li>
              ) : null}
            </ol>
          </li>);
        })}
      </ol>
    </div>
  </div>
</section>
{/* Final Insight */}
{/* <div className="bg-white rounded shadow p-4">
  <ol>
    {Object.entries(cosmic.final_consolidated_insight).map(([key, value]) => (
      <li key={key}>
        <span className="description font-semibold!">{formatKey(key)}:</span> {typeof value === 'string' ? value : null}
      </li>
    ))}
  </ol>
</div> */}



// function formatKey(key: string) {
//   return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
// }

// function formatValue(value: string) {
//   // Format numbers with commas; leave other types as string
//   return typeof value === "number"
//     ? new Intl.NumberFormat("en-IN").format(value)
//     : String(value);
// }