import { useMemo, useState } from "react";
import CreateClassForm from "../components/admin/CreateClassForm";
import {
    BuildingIcon,
    CheckBadgeIcon,
    RefreshIcon,
    SeatIcon,
    UsersIcon,
} from "../components/Icons";

function Admin({ classes = [], onClassesChanged }) {
    const [refreshing, setRefreshing] = useState(false);

    const totals = useMemo(
        () =>
            classes.reduce(
                (accumulator, schoolClass) => {
                    const totalSeats = schoolClass.totalSeats ?? 0;
                    const heldSeats = schoolClass.heldSeats ?? 0;
                    const confirmedSeats = schoolClass.confirmedSeats ?? 0;

                    accumulator.seats += totalSeats;
                    accumulator.held += heldSeats;
                    accumulator.confirmed += confirmedSeats;
                    accumulator.available +=
                        schoolClass.availableSeats ??
                        Math.max(0, totalSeats - heldSeats - confirmedSeats);

                    return accumulator;
                },
                { seats: 0, held: 0, confirmed: 0, available: 0 }
            ),
        [classes]
    );

    const occupancy = totals.seats
        ? Math.round(((totals.held + totals.confirmed) / totals.seats) * 100)
        : 0;

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await onClassesChanged?.();
        } finally {
            setRefreshing(false);
        }
    };

    const statCards = [
        {
            label: "Total classes",
            value: classes.length,
            icon: BuildingIcon,
            tone: "bg-brand-50 text-brand-600",
        },
        {
            label: "Total seats",
            value: totals.seats,
            icon: SeatIcon,
            tone: "bg-sky-50 text-sky-600",
        },
        {
            label: "Seats occupied",
            value: totals.held + totals.confirmed,
            icon: UsersIcon,
            tone: "bg-amber-50 text-amber-600",
        },
        {
            label: "Seats available",
            value: totals.available,
            icon: CheckBadgeIcon,
            tone: "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <section aria-labelledby="admin-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                        Administration
                    </p>

                    <h2
                        id="admin-heading"
                        className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]"
                    >
                        Admin console
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Create admission classes and monitor seat capacity in
                        real time.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 sm:inline-flex">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Live data
                    </span>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshIcon
                            className={`h-3.5 w-3.5 ${
                                refreshing ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-2.5">
                            <span
                                className={`grid h-8 w-8 place-items-center rounded-xl ${card.tone}`}
                            >
                                <card.icon className="h-4 w-4" />
                            </span>

                            <p className="text-xs font-medium text-slate-500">
                                {card.label}
                            </p>
                        </div>

                        <p className="tabular mt-3 text-2xl font-bold tracking-tight text-slate-900">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-semibold text-slate-600">
                    Overall seat utilisation
                </p>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                    />
                </div>

                <p className="tabular text-xs font-bold text-slate-700">
                    {occupancy}%
                </p>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                        <BuildingIcon className="h-5 w-5" />
                    </span>

                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Create a new class
                        </h3>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Add a class and set its seat capacity. It becomes
                            available to students right away.
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <CreateClassForm onClassCreated={onClassesChanged} />
                </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Existing classes
                        </h3>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Seat counts refresh automatically every few seconds.
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {classes.length} class
                        {classes.length === 1 ? "" : "es"}
                    </span>
                </div>

                {classes.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                            <BuildingIcon className="h-6 w-6" />
                        </div>

                        <h4 className="mt-4 text-base font-bold text-slate-900">
                            No classes yet
                        </h4>

                        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
                            Create your first admission class using the form
                            above.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {classes.map((schoolClass) => {
                            const totalSeats = schoolClass.totalSeats ?? 0;
                            const heldSeats = schoolClass.heldSeats ?? 0;
                            const confirmedSeats =
                                schoolClass.confirmedSeats ?? 0;
                            const availableSeats =
                                schoolClass.availableSeats ??
                                Math.max(
                                    0,
                                    totalSeats - heldSeats - confirmedSeats
                                );

                            const safeTotal = Math.max(totalSeats, 1);
                            const confirmedWidth = Math.min(
                                100,
                                (confirmedSeats / safeTotal) * 100
                            );
                            const heldWidth = Math.min(
                                100 - confirmedWidth,
                                (heldSeats / safeTotal) * 100
                            );

                            const availability =
                                availableSeats <= 0
                                    ? {
                                          label: "Full",
                                          chip: "bg-rose-50 text-rose-700 ring-rose-200",
                                          dot: "bg-rose-500",
                                      }
                                    : availableSeats <= 3
                                        ? {
                                              label: "Low",
                                              chip: "bg-amber-50 text-amber-700 ring-amber-200",
                                              dot: "bg-amber-500",
                                          }
                                        : {
                                              label: "Open",
                                              chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
                                              dot: "bg-emerald-500",
                                          };

                            return (
                                <li
                                    key={schoolClass.id}
                                    className="grid gap-4 px-5 py-4 transition hover:bg-slate-50/70 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center sm:px-6"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                            <BuildingIcon className="h-4.5 w-4.5" />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {schoolClass.name}
                                            </p>
                                            <p className="tabular mt-0.5 text-xs text-slate-400">
                                                Capacity {totalSeats}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span>
                                                {confirmedSeats + heldSeats}{" "}
                                                occupied
                                            </span>
                                            <span>{availableSeats} free</span>
                                        </div>

                                        <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full bg-slate-800"
                                                style={{
                                                    width: `${confirmedWidth}%`,
                                                }}
                                            />
                                            <div
                                                className="h-full bg-amber-400"
                                                style={{
                                                    width: `${heldWidth}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:justify-end">
                                        <div className="text-left sm:text-right">
                                            <p className="text-[11px] text-slate-400">
                                                Available
                                            </p>
                                            <p className="tabular text-sm font-bold text-slate-800">
                                                {availableSeats}
                                            </p>
                                        </div>

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${availability.chip}`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${availability.dot}`}
                                            />
                                            {availability.label}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default Admin;
