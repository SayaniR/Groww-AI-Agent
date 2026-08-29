import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Delete } from "lucide-react";
import Loader from "../components/loader";

const C = {
    primary: "#00D09C",
    ink: "#202124",
    slate: "#7B8085",
    border: "#E5E7E9",
    soft: "#F7F8F8",
    disabled: "#EDEEEE",
};

const FONT =
    "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function formatINR(value) {
    if (value === "" || value === null || value === undefined) {
        return "0";
    }

    return Number(value).toLocaleString("en-IN");
}

export default function PaymentScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    // Amount comes from GrantScreen
    const initialAmount = location.state?.amount || 0;
    const grantData = location.state || {};
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(Number(initialAmount));
    const [agreed, setAgreed] = useState(true);
    const [progress, setProgress] = useState(0);
    const quickAmounts = [10000, 20000, 50000];

    const addAmount = (value) => {
        setAmount((prev) => prev + value);
    };

    const handleKeyPress = (key) => {
        setAmount((prev) => {
            const current = String(prev || "");

            if (key === "backspace") {
                const next = current.slice(0, -1);
                return next === "" ? 0 : Number(next);
            }

            if (key === ".") {
                return prev;
            }

            const next = `${current}${key}`;

            // Prevent unnecessary leading zeroes
            return Number(next);
        });
    };

    const handlePayment = () => {
        console.log("Payment initiated:", amount);

        setLoading(true);
        setProgress(0);

        const startTime = Date.now();
        const duration = 2000;

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min(
                Math.round((elapsed / duration) * 100),
                100
            );

            setProgress(percentage);

            if (percentage >= 100) {
                clearInterval(timer);

                navigate("/activity", {
                    state: {grantData
                        // additionalInstruction,
                        // permissions,
                        // sectorLimits,
                    },
                });
            }
        }, 20);
    };

    if (loading) {
        return <Loader percent={progress} />;
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                minHeight: "100%",
                background: "#FFFFFF",
                fontFamily: FONT,
                color: C.ink,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "16px 18px 8px",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        width: 36,
                        height: 36,
                        border: "none",
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        cursor: "pointer",
                    }}
                >
                    <ArrowLeft
                        size={24}
                        strokeWidth={2}
                        color={C.ink}
                    />
                </button>

                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}
                >
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        Add money
                    </div>

                    <div
                        style={{
                            fontSize: 13,
                            color: C.slate,
                            marginTop: 2,
                        }}
                    >
                        Cash: ₹0.0 available
                    </div>
                </div>
            </div>

            {/* Amount area */}
            <div
                style={{
                    padding: "52px 20px 24px",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 600,
                        letterSpacing: -1.5,
                        color: amount > 0 ? C.ink : "#6F7478",
                    }}
                >
                    ₹ {formatINR(amount)}
                </div>

                {/* Quick amount buttons */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                        marginTop: 48,
                    }}
                >
                    {quickAmounts.map((value) => (
                        <button
                            key={value}
                            onClick={() => addAmount(value)}
                            style={{
                                border: `1.5px solid ${C.border}`,
                                background: "#FFFFFF",
                                borderRadius: 999,
                                padding: "10px 14px",
                                fontSize: 13,
                                fontWeight: 600,
                                color: C.ink,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            + ₹{formatINR(value)}
                        </button>
                    ))}
                </div>
            </div>

            {/* UPI account */}
            <div
                style={{
                    borderTop: `1px solid ${C.border}`,
                    borderBottom: `1px solid ${C.border}`,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 10,
                }}
            >
                {/* UPI icon */}
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "#4D62E8",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: 35,
                            height: 22,
                            background: "#00D09C",
                            bottom: -4,
                            left: 8,
                            borderRadius: "50% 50% 0 0",
                            transform: "rotate(-20deg)",
                        }}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            marginBottom: 3,
                        }}
                    >
                        Groww UPI
                    </div>

                    <div
                        style={{
                            fontSize: 13,
                            color: C.slate,
                        }}
                    >
                        AXIS BANK · · · · 9062
                    </div>
                </div>

                <ChevronRight
                    size={22}
                    color={C.slate}
                />
            </div>

            {/* Keypad */}
            <div
                style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(4, 1fr)",
                    padding: "12px 22px 4px",
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                {[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    ".",
                    "0",
                    "backspace",
                ].map((key) => (
                    <button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            background: "transparent",
                            color: C.ink,
                            fontSize: key === "backspace" ? 25 : 28,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        {key === "backspace" ? (
                            <Delete
                                size={27}
                                strokeWidth={1.8}
                            />
                        ) : (
                            key
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom action */}
            <div
                style={{
                    padding: "8px 18px 18px",
                    background: "#FFFFFF",
                }}
            >
                {/* Terms */}
                <div
                    onClick={() => setAgreed((prev) => !prev)}
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 9,
                        cursor: "pointer",
                        marginBottom: 12,
                    }}
                >
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            minWidth: 20,
                            borderRadius: 4,
                            background: agreed
                                ? "#9CA1A5"
                                : "#FFFFFF",
                            border: agreed
                                ? "none"
                                : `1.5px solid ${C.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF",
                            fontSize: 14,
                            fontWeight: 700,
                        }}
                    >
                        {agreed && "✓"}
                    </div>

                    <div
                        style={{
                            fontSize: 12,
                            color: C.slate,
                            lineHeight: 1.45,
                        }}
                    >
                        I agree to{" "}
                        <span
                            style={{
                                textDecoration: "underline",
                                fontWeight: 600,
                            }}
                        >
                            Groww Pay's T&C
                        </span>{" "}
                        and{" "}
                        <span
                            style={{
                                textDecoration: "underline",
                                fontWeight: 600,
                            }}
                        >
                            Privacy policy
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    disabled={!amount || !agreed}
                    onClick={handlePayment}
                    style={{
                        width: "100%",
                        height: 52,
                        border: "none",
                        borderRadius: 12,
                        background:
                            amount && agreed
                                ? C.primary
                                : C.disabled,
                        color:
                            amount && agreed
                                ? "#FFFFFF"
                                : "#B5B9BC",
                        fontSize: 15,
                        fontWeight: 700,
                        fontFamily: FONT,
                        cursor:
                            amount && agreed
                                ? "pointer"
                                : "default",
                    }}
                >
                    Pay ₹{formatINR(amount)}
                </button>
            </div>
        </div>
    );
}