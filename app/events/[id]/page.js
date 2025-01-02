export default async function EventPage({ params }) {
  const { id } = await Promise.resolve(params);

  return (
      <div className="p-6">
          <h1 className="text-3xl font-bold">Event {id}</h1>
          <p className="text-gray-600">
              Details about event {id} will go here.
          </p>
      </div>
  );
}