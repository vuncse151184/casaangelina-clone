"use client";

import { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "../../i18n/I18nContext";

interface RoomConfig {
    roomType: string;
    adults: number;
    children: number;
}

interface BookNowModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DEFAULT_ROOM: RoomConfig = { roomType: "deluxe", adults: 2, children: 0 };
const MAX_ROOMS = 4;
const MAX_ADULTS = 6;
const MAX_CHILDREN = 4;

export default function BookNowModal({ isOpen, onClose }: BookNowModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        message: "",
    });
    const [rooms, setRooms] = useState<RoomConfig[]>([{ ...DEFAULT_ROOM }]);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        },
        []
    );

    const addRoom = useCallback(() => {
        setRooms((prev) =>
            prev.length < MAX_ROOMS ? [...prev, { ...DEFAULT_ROOM }] : prev
        );
    }, []);

    const removeRoom = useCallback((index: number) => {
        setRooms((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
    }, []);

    const updateRoom = useCallback(
        (index: number, field: keyof RoomConfig, value: string | number) => {
            setRooms((prev) =>
                prev.map((room, i) => (i === index ? { ...room, [field]: value } : room))
            );
        },
        []
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            console.log("Booking submitted:", { ...formData, rooms });
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    checkIn: "",
                    checkOut: "",
                    message: "",
                });
                setRooms([{ ...DEFAULT_ROOM }]);
                onClose();
            }, 2500);
        },
        [formData, rooms, onClose]
    );
    const { t } = useTranslation();

    const today = new Date().toISOString().split("T")[0];

    const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
    const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
            <DialogContent
                className="md:max-w-[70%] lg:max-w-[70%] sm:max-w-[780px] border-[#e0d5c7] bg-[#faf8f5] p-8 sm:p-10 gap-6 max-h-[90vh] overflow-y-auto"
                showCloseButton
                data-lenis-prevent
            >
                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8b7355"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#2a2a2a]">
                            Thank you!
                        </h3>
                        <p className="text-sm text-[#8b7355] max-w-[280px] leading-relaxed">
                            {t("booking.confirmBookingMsg")}
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="gap-3 mb-2">
                            <DialogTitle className="text-[28px] font-normal text-[#2a2a2a] tracking-tight" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                                {t("booking.title")}
                            </DialogTitle>
                            <DialogDescription className="text-[#8b7355] text-sm tracking-wide">
                                {t("booking.content")}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-1">
                            {/* Name + Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="book-name" className="text-[11px] tracking-[0.15em] uppercase text-[#6b5a48]">
                                        {t("booking.fullName")}
                                    </Label>
                                    <Input
                                        id="book-name"
                                        name="name"
                                        required
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="border-[#e0d5c7] focus-visible:ring-[#8b7355]/20 focus-visible:border-[#8b7355]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="book-email" className="text-[11px] tracking-[0.15em] uppercase text-[#6b5a48]">
                                        {t("booking.email")}
                                    </Label>
                                    <Input
                                        id="book-email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border-[#e0d5c7] focus-visible:ring-[#8b7355]/20 focus-visible:border-[#8b7355]"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="book-phone" className="text-[11px] tracking-[0.15em] uppercase text-[#6b5a48]">
                                    {t("booking.phone")}
                                </Label>
                                <Input
                                    id="book-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+84 xxx xxx xxx"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border-[#e0d5c7] focus-visible:ring-[#8b7355]/20 focus-visible:border-[#8b7355] w-full sm:w-1/2"
                                />
                            </div>

                            {/* Rooms & Guests */}
                            <div className="space-y-1">
                                <Label className="text-[11px] tracking-[0.15em] uppercase text-[#6b5a48]">
                                    {t("booking.rooms")}
                                </Label>
                                <div className="border border-[#e0d5c7] rounded-lg bg-white/60">
                                    {rooms.map((room, index) => (
                                        <div key={index}>
                                            {/* Separator between rooms */}
                                            {index > 0 && <div className="border-t border-[#e0d5c7]" />}

                                            <div className="p-4 sm:p-5">
                                                {/* Room header */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[12px] tracking-[0.1em] uppercase font-medium text-[#8b7355]">
                                                        Room {index + 1}
                                                    </span>
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRoom(index)}
                                                            className="flex items-center justify-center w-6 h-6 rounded-full text-[#a09080] hover:text-[#8b7355] hover:bg-[#f0ebe4] transition-colors"
                                                            aria-label={`Remove Room ${index + 1}`}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Room content: Room type + Adults + Children */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    {/* Room Type */}
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] tracking-[0.1em] uppercase text-[#a09080]">{t("booking.roomType")}</span>
                                                        <Select
                                                            value={room.roomType}
                                                            onValueChange={(v) => updateRoom(index, "roomType", v)}
                                                        >
                                                            <SelectTrigger className="border-[#e0d5c7] focus:ring-[#8b7355]/20 w-full h-9 text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="standard">Standard Room</SelectItem>
                                                                <SelectItem value="deluxe">Deluxe Room</SelectItem>
                                                                <SelectItem value="suite">Junior Suite</SelectItem>
                                                                <SelectItem value="penthouse">Penthouse Suite</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Adults counter */}
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] tracking-[0.1em] uppercase text-[#a09080]">{t("booking.adults")}</span>
                                                        <div className="flex items-center h-9 border border-[#e0d5c7] rounded-md overflow-hidden">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateRoom(index, "adults", Math.max(1, room.adults - 1))}
                                                                className="flex items-center justify-center w-9 h-full text-[#6b5a48] hover:bg-[#f0ebe4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={room.adults <= 1}
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                            <span className="flex-1 text-center text-sm text-[#2a2a2a] font-medium select-none">
                                                                {room.adults}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateRoom(index, "adults", Math.min(MAX_ADULTS, room.adults + 1))}
                                                                className="flex items-center justify-center w-9 h-full text-[#6b5a48] hover:bg-[#f0ebe4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={room.adults >= MAX_ADULTS}
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Children counter */}
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] tracking-[0.1em] uppercase text-[#a09080]">{t("booking.children")}</span>
                                                        <div className="flex items-center h-9 border border-[#e0d5c7] rounded-md overflow-hidden">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateRoom(index, "children", Math.max(0, room.children - 1))}
                                                                className="flex items-center justify-center w-9 h-full text-[#6b5a48] hover:bg-[#f0ebe4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={room.children <= 0}
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                            <span className="flex-1 text-center text-sm text-[#2a2a2a] font-medium select-none">
                                                                {room.children}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateRoom(index, "children", Math.min(MAX_CHILDREN, room.children + 1))}
                                                                className="flex items-center justify-center w-9 h-full text-[#6b5a48] hover:bg-[#f0ebe4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={room.children >= MAX_CHILDREN}
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add room button + Summary */}
                                    <div className="border-t border-[#e0d5c7] px-4 sm:px-5 py-3 flex items-center justify-between">
                                        {rooms.length < MAX_ROOMS ? (
                                            <button
                                                type="button"
                                                onClick={addRoom}
                                                className="flex items-center gap-1.5 text-[12px] tracking-[0.05em] text-[#8b7355] hover:text-[#6b5a48] transition-colors font-medium"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                                {t("booking.addRoom")}
                                            </button>
                                        ) : (
                                            <span className="text-[11px] text-[#a09080] italic">Maximum rooms reached</span>
                                        )}
                                        <span className="text-[11px] text-[#8b7355] tracking-wide">
                                            {rooms.length} {t("booking.rooms")} · {totalAdults} {totalAdults === 1 ? t("booking.adult") : t("booking.adults")}{totalChildren > 0 && ` · ${totalChildren} ${t("booking.children")}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Check-in + Check-out */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="book-checkin" className="text-[11px] tracking-[0.15em] uppercase text-[#6b5a48]">
                                        {t("booking.checkIn")}
                                    </Label>
                                    <Input
                                        id="book-checkin"
                                        name="checkIn"
                                        type="date"
                                        required
                                        min={today}
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                        className="border-[#e0d5c7] focus-visible:ring-[#8b7355]/20 focus-visible:border-[#8b7355]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="book-checkout" className="text-[11px] tracking-[0.15em] uppercase text-[#6b5a48]">
                                        {t("booking.checkOut")}
                                    </Label>
                                    <Input
                                        id="book-checkout"
                                        name="checkOut"
                                        type="date"
                                        required
                                        min={formData.checkIn || today}
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                        className="border-[#e0d5c7] focus-visible:ring-[#8b7355]/20 focus-visible:border-[#8b7355]"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="book-message" className="text-[11px] tracking-[0.15em] uppercase text-[#6b5a48]">
                                    {t("booking.message")}
                                </Label>
                                <Textarea
                                    id="book-message"
                                    name="message"
                                    rows={3}
                                    placeholder="Any special requests or notes..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="border-[#e0d5c7] focus-visible:ring-[#8b7355]/20 focus-visible:border-[#8b7355] resize-y min-h-[80px]"
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full mt-4 bg-[#2a2a2a] hover:bg-[#8b7355] text-white tracking-[0.18em] uppercase text-[13px] h-12 transition-all duration-300"
                            >
                                {t("booking.submit")}
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="ml-2"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
