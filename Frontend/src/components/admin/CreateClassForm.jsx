import { useState } from "react";
import { createClass } from "../../services/classService";
import {
    AlertIcon,
    CheckIcon,
    SpinnerIcon,
} from "../Icons";

function CreateClassForm({ onClassCreated }) {
    const [name, setName] = useState("");
    const [totalSeats, setTotalSeats] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Enter a name for the class.");
            return;
        }

        if (!totalSeats || Number(totalSeats) <= 0) {
            setError("Total seats must be greater than zero.");
            return;
        }

        try {
            setLoading(true);

            await createClass({
                name: name.trim(),
                totalSeats: Number(totalSeats),
            });

            setMessage("Class created. It is now open for applications.");
            setName("");
            setTotalSeats("");

            await onClassCreated?.();
        } catch (requestError) {
            console.error("Failed to create class:", requestError);

            if (requestError.response?.data?.errors) {
                const firstError = Object.values(
                    requestError.response.data.errors
                )
                    .flat()
                    .find(Boolean);

                setError(firstError ?? "We couldn't create the class.");
            } else if (requestError.response?.data?.message) {
                setError(requestError.response.data.message);
            } else {
                setError("We couldn't create the class. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="className"
                            className="text-sm font-semibold text-slate-800"
                        >
                            Class name
                        </label>

                        <input
                            id="className"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Class 7 · Morning shift"
                            maxLength={150}
                            disabled={loading}
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Use a name students will recognise.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="totalSeats"
                            className="text-sm font-semibold text-slate-800"
                        >
                            Total seats
                        </label>

                        <input
                            id="totalSeats"
                            type="number"
                            min="1"
                            step="1"
                            value={totalSeats}
                            onChange={(event) =>
                                setTotalSeats(event.target.value)
                            }
                            placeholder="50"
                            disabled={loading}
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Held and confirmed seats both count toward capacity.
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300 disabled:shadow-none"
                    >
                        {loading ? (
                            <>
                                <SpinnerIcon className="h-4 w-4" />
                                Creating…
                            </>
                        ) : (
                            <>
                                <span className="text-base leading-none">+</span>
                                Create class
                            </>
                        )}
                    </button>

                    <p className="text-xs text-slate-400">
                        New classes appear in the student portal immediately.
                    </p>
                </div>
            </form>

            {message && (
                <div
                    role="status"
                    className="animate-fade mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3"
                >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckIcon className="h-3 w-3" />
                    </span>

                    <div>
                        <p className="text-sm font-semibold text-emerald-800">
                            Class created
                        </p>
                        <p className="mt-0.5 text-xs text-emerald-700">
                            {message}
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="animate-fade mt-5 flex items-start gap-2.5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3"
                >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <AlertIcon className="h-3 w-3" />
                    </span>

                    <div>
                        <p className="text-sm font-semibold text-rose-800">
                            Unable to create class
                        </p>
                        <p className="mt-0.5 text-xs text-rose-700">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateClassForm;
