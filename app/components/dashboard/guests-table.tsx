"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Upload,
  Check,
  X,
  Clock,
  Phone,
  Users,
  MessageCircle,
  QrCode,
  PenLine,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  StickyNote,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RsvpStatus, GuestSource } from "@/types/dashboard";
import { useDashboardStore } from "@/store/dashboard-store";
import { guests as demoGuests } from "@/mock-data/dashboard";

type SortField = "name" | "guestCount" | "rsvpStatus";
type SortOrder = "asc" | "desc";

function getSortIcon(
  sortField: SortField,
  sortOrder: SortOrder,
  field: SortField
) {
  if (sortField !== field) return <ArrowUpDown className="size-3" />;
  return sortOrder === "asc" ? (
    <ArrowUp className="size-3" />
  ) : (
    <ArrowDown className="size-3" />
  );
}

function RsvpBadge({ status, t }: { status: RsvpStatus; t: (key: string) => string }) {
  if (status === "confirmed") {
    return (
      <div
        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-500/40 w-fit"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 30%, rgba(16, 185, 129, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
        }}
      >
        <Check className="size-3.5 text-emerald-400" />
        <span className="text-sm font-medium text-emerald-400">{t("confirmedStatus")}</span>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div
        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-500/40 w-fit"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(244, 63, 94, 0.12) 0%, rgba(244, 63, 94, 0.06) 30%, rgba(244, 63, 94, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
        }}
      >
        <X className="size-3.5 text-rose-400" />
        <span className="text-sm font-medium text-rose-400">{t("declinedStatus")}</span>
      </div>
    );
  }

  if (status === "guest") {
    return (
      <div
        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-500/40 w-fit"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 30%, rgba(59, 130, 246, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
        }}
      >
        <Users className="size-3.5 text-blue-400" />
        <span className="text-sm font-medium text-blue-400">{t("guestStatus")}</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-500/40 w-fit"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.06) 30%, rgba(245, 158, 11, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
      }}
    >
      <Clock className="size-3.5 text-amber-400" />
      <span className="text-sm font-medium text-amber-400">{t("pendingStatus")}</span>
    </div>
  );
}

function SourceBadge({ source, t }: { source: GuestSource; t: (key: string) => string }) {
  const sourceConfig: Record<
    GuestSource,
    { icon: React.ReactNode; label: string; bgClass: string; textClass: string }
  > = {
    whatsapp: {
      icon: <MessageCircle className="size-3" />,
      label: "WhatsApp",
      bgClass: "bg-green-500/10",
      textClass: "text-green-400",
    },
    manual: {
      icon: <PenLine className="size-3" />,
      label: t("sourceManual"),
      bgClass: "bg-gray-500/10",
      textClass: "text-gray-400",
    },
    "qr-code": {
      icon: <QrCode className="size-3" />,
      label: t("sourceQrCode"),
      bgClass: "bg-violet-500/10",
      textClass: "text-violet-400",
    },
  };

  const config = sourceConfig[source];

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit ${config.bgClass}`}
    >
      <span className={config.textClass}>{config.icon}</span>
      <span className={`text-xs font-medium ${config.textClass}`}>
        {config.label}
      </span>
    </div>
  );
}

export function GuestsTable({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const {
    guests: storeGuests,
    searchQuery,
    rsvpFilter,
    sourceFilter,
    setSearchQuery,
    setRsvpFilter,
    setSourceFilter,
    clearFilters,
  } = useDashboardStore();

  const guests = isDemo
    ? demoGuests.map((g) => ({ ...g, _id: g.id, createdAt: "", updatedAt: "" }))
    : storeGuests;

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredAndSortedGuests = useMemo(() => {
    const result = guests.filter((guest) => {
      const matchesSearch =
        searchQuery === "" ||
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone.includes(searchQuery);

      const matchesRsvp =
        rsvpFilter === "all" || guest.rsvpStatus === rsvpFilter;
      const matchesSource =
        sourceFilter === "all" || guest.source === sourceFilter;

      return matchesSearch && matchesRsvp && matchesSource;
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "guestCount":
          comparison = a.guestCount - b.guestCount;
          break;
        case "rsvpStatus":
          comparison = a.rsvpStatus.localeCompare(b.rsvpStatus);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [guests, searchQuery, rsvpFilter, sourceFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedGuests.length / itemsPerPage);
  const paginatedGuests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedGuests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedGuests, currentPage, itemsPerPage]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleSelectAll = () => {
    if (isDemo) return;
    if (selectedGuests.length === paginatedGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(paginatedGuests.map((guest) => guest._id));
    }
  };

  const toggleSelectGuest = (id: string) => {
    if (isDemo) return;
    setSelectedGuests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    rsvpFilter !== "all" ||
    sourceFilter !== "all";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedGuests([]);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    setSelectedGuests([]);
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3.5 border-b">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-base">{t("guestManagement")}</h3>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-[200px] text-sm bg-muted/50 border-border/50"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 bg-muted/50 border-border/50"
                >
                  <SlidersHorizontal className="size-3.5" />
                  <span>{t("filter")}</span>
                  {hasActiveFilters && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {t("rsvpStatus")}
                  </p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={rsvpFilter === "all"}
                      onCheckedChange={() => setRsvpFilter("all")}
                    >
                      {t("all")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={rsvpFilter === "confirmed"}
                      onCheckedChange={() => setRsvpFilter("confirmed")}
                    >
                      <Check className="size-3 mr-1.5 text-emerald-400" />
                      {t("confirmedStatus")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={rsvpFilter === "declined"}
                      onCheckedChange={() => setRsvpFilter("declined")}
                    >
                      <X className="size-3 mr-1.5 text-rose-400" />
                      {t("declinedStatus")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={rsvpFilter === "pending"}
                      onCheckedChange={() => setRsvpFilter("pending")}
                    >
                      <Clock className="size-3 mr-1.5 text-amber-400" />
                      {t("pendingStatus")}
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {t("source")}
                  </p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={sourceFilter === "all"}
                      onCheckedChange={() => setSourceFilter("all")}
                    >
                      {t("all")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sourceFilter === "whatsapp"}
                      onCheckedChange={() => setSourceFilter("whatsapp")}
                    >
                      <MessageCircle className="size-3 mr-1.5 text-green-400" />
                      WhatsApp
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sourceFilter === "manual"}
                      onCheckedChange={() => setSourceFilter("manual")}
                    >
                      <PenLine className="size-3 mr-1.5 text-gray-400" />
                      {t("sourceManual")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sourceFilter === "qr-code"}
                      onCheckedChange={() => setSourceFilter("qr-code")}
                    >
                      <QrCode className="size-3 mr-1.5 text-violet-400" />
                      {t("sourceQrCode")}
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
                {hasActiveFilters && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearFilters}>
                      {t("clearFilters")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 bg-muted/50 border-border/50"
                >
                  <ArrowUpDown className="size-3.5" />
                  <span>{t("sort")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => toggleSort("name")}>
                  {t("sortName")}{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("guestCount")}>
                  {t("sortGuestCount")}{" "}
                  {sortField === "guestCount" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("rsvpStatus")}>
                  {t("rsvpStatus")}{" "}
                  {sortField === "rsvpStatus" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 bg-muted/50 border-border/50"
              >
                <Upload className="size-3.5" />
                <span className="hidden sm:inline">{t("export")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("exportCsv")}</DropdownMenuItem>
              <DropdownMenuItem>{t("exportExcel")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="sm:hidden flex flex-wrap items-center gap-2 px-4 py-3 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 w-full text-sm bg-muted/50 border-border/50"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-muted/50 border-border/50"
            >
              <SlidersHorizontal className="size-3.5" />
              {hasActiveFilters && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                {t("rsvpStatus")}
              </p>
              <div className="space-y-1">
                <DropdownMenuCheckboxItem
                  checked={rsvpFilter === "all"}
                  onCheckedChange={() => setRsvpFilter("all")}
                >
                  {t("all")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={rsvpFilter === "confirmed"}
                  onCheckedChange={() => setRsvpFilter("confirmed")}
                >
                  {t("confirmedStatus")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={rsvpFilter === "declined"}
                  onCheckedChange={() => setRsvpFilter("declined")}
                >
                  {t("declinedStatus")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={rsvpFilter === "pending"}
                  onCheckedChange={() => setRsvpFilter("pending")}
                >
                  {t("pendingStatus")}
                </DropdownMenuCheckboxItem>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                {t("source")}
              </p>
              <div className="space-y-1">
                <DropdownMenuCheckboxItem
                  checked={sourceFilter === "all"}
                  onCheckedChange={() => setSourceFilter("all")}
                >
                  {t("all")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sourceFilter === "whatsapp"}
                  onCheckedChange={() => setSourceFilter("whatsapp")}
                >
                  WhatsApp
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sourceFilter === "manual"}
                  onCheckedChange={() => setSourceFilter("manual")}
                >
                  {t("sourceManual")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sourceFilter === "qr-code"}
                  onCheckedChange={() => setSourceFilter("qr-code")}
                >
                  {t("sourceQrCode")}
                </DropdownMenuCheckboxItem>
              </div>
            </div>
            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  {t("clearFilters")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-muted/50 border-border/50"
            >
              <ArrowUpDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleSort("name")}>
              {t("sortName")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort("guestCount")}>
              {t("sortGuestCount")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort("rsvpStatus")}>
              {t("rsvpStatus")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/30">
              <TableHead className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectedGuests.length === paginatedGuests.length &&
                      paginatedGuests.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    disabled={isDemo}
                    className="border-border/50 bg-background/70"
                  />
                  <button
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSort("name")}
                  >
                    <span>{t("sortName")}</span>
                    {getSortIcon(sortField, sortOrder, "name")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="w-[140px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="size-3.5" />
                  <span>{t("tablePhone")}</span>
                </div>
              </TableHead>
              <TableHead className="w-[120px]">
                <button
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort("rsvpStatus")}
                >
                  <Check className="size-3.5" />
                  <span>{t("rsvpStatus")}</span>
                  {getSortIcon(sortField, sortOrder, "rsvpStatus")}
                </button>
              </TableHead>
              <TableHead className="w-[100px]">
                <button
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort("guestCount")}
                >
                  <Users className="size-3.5" />
                  <span>{t("sortGuestCount")}</span>
                  {getSortIcon(sortField, sortOrder, "guestCount")}
                </button>
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <QrCode className="size-3.5" />
                  <span>{t("source")}</span>
                </div>
              </TableHead>
              <TableHead className="w-[160px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <StickyNote className="size-3.5" />
                  <span>{t("tableNote")}</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGuests.map((guest) => (
              <TableRow key={guest._id} className="border-border/50">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={selectedGuests.includes(guest._id)}
                      onCheckedChange={() => toggleSelectGuest(guest._id)}
                      disabled={isDemo}
                      className="border-border/50 bg-background/70"
                    />
                    <Avatar className="size-6">
                      <AvatarFallback className="text-xs">
                        {guest.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{guest.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm whitespace-nowrap">
                    {guest.phone}
                  </span>
                </TableCell>
                <TableCell>
                  <RsvpBadge status={guest.rsvpStatus} t={t} />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {guest.guestCount}
                  </span>
                </TableCell>
                <TableCell>
                  <SourceBadge source={guest.source} t={t} />
                </TableCell>
                <TableCell className="max-w-[200px]">
                  {guest.note ? (
                    <span
                      className="text-sm text-muted-foreground truncate block cursor-help"
                      title={guest.note}
                    >
                      {guest.note}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(
              currentPage * itemsPerPage,
              filteredAndSortedGuests.length
            )}{" "}
            {t("paginationRange")} {filteredAndSortedGuests.length} {t("paginationGuests")}
          </span>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">{t("paginationShow")}</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="h-8 w-[70px] bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">{t("paginationPerPage")}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  className="size-8"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
