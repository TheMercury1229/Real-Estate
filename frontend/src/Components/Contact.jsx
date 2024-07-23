import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message);
          return;
        }
        setLandlord(data);
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while fetching landlord data");
      }
    };

    if (listing.userRef) {
      fetchLandlord();
    }
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-lg">
            Contact{" "}
            <span className="font-semibold">
              {landlord.username.toLowerCase()}
            </span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            placeholder="Enter Your Message Here..."
            rows={2}
            className="w-full p-3 rounded-lg border resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}
            className="bg-yellow-800 text-white text-center max-w-[500px]  p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
