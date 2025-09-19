// src/components/ResponseRenderer.jsx
export default function ResponseRenderer({ reply }) {
  if (!reply) return null

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg shadow-lg text-gray-200">
      {/* Overview */}
      <section>
        <h2 className="text-xl font-bold mb-2">🔧 Overview</h2>
        <p>{reply.overview}</p>
      </section>

      {/* Diagnostic Steps */}
      <section>
        <h2 className="text-lg font-semibold">🧪 Diagnostic Steps</h2>
        <ul className="list-disc pl-5">
          {reply.diagnostic_steps?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </section>

      {/* Repair Steps */}
      <section>
        <h2 className="text-lg font-semibold">🛠 Repair Steps</h2>
        <ul className="list-decimal pl-5">
          {reply.repair_steps?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </section>

      {/* Tools */}
      <section>
        <h2 className="text-lg font-semibold">🧰 Tools</h2>
        <ul className="list-disc pl-5">
          {reply.tools?.map((tool, i) => (
            <li key={i}>{tool}</li>
          ))}
        </ul>
      </section>

      {/* Parts */}
      <section>
        <h2 className="text-lg font-semibold">🔩 Parts</h2>
        <ul className="list-disc pl-5">
          {reply.parts?.map((part, i) => (
            <li key={i}>
              {part.name} ({part.price_range}){" "}
              <a
                href={part.links?.oreilly}
                className="text-blue-400 underline"
                target="_blank"
              >
                Buy
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Cost + Time */}
      <section>
        <h2 className="text-lg font-semibold">⏱ Time & Cost</h2>
        <p>⏳ {reply.time_estimate}</p>
        <p>💲 {reply.cost_estimate}</p>
      </section>

      {/* Videos */}
      <section>
        <h2 className="text-lg font-semibold">🎥 Videos</h2>
        <ul className="list-disc pl-5">
          {reply.videos?.map((vid, i) => (
            <li key={i}>
              <a href={vid} className="text-blue-400 underline" target="_blank">
                {vid}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
