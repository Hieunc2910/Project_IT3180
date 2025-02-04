import React, { useState } from "react";
import { api } from "@/utils/api";
import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecentPayments } from "@/components/page-component/dashboard/recent-payments";
import ApartmentModal from "@/components/page-component/dashboard/apartment-modal";
import { PiggyBank, Users, Warehouse, AlertOctagonIcon, Receipt } from "lucide-react";
import { format } from "date-fns";
import { Loading } from "@/components/common/loading";
import { Overview } from "@/components/page-component/dashboard/overview";
import UnpaidFeesModal from "@/components/page-component/dashboard/unpaid-fees-modal";
import BreadCrumb from "@/components/ui/breadcrumb";
import ResidentModal from "@/components/page-component/dashboard/resident-modal";
const Dashboard = () => {
  const breadcrumbItems = [{ title: "", link: "" }];
  const [isApartmentModalOpen, setIsApartmentModalOpen] = useState(false);
  const [isUnpaidFeesModalOpen, setIsUnpaidFeesModalOpen] = useState(false);
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);

  const {
    data: residentCount = 0,
    isLoading: isLoadingResidentCount,
    isError: isErrorResidentCount,
    error: errorResidentCount,
  } = api.resident.getCount.useQuery();

  const {
    data: occupiedApartments,
    isLoading: isLoadingApartments,
    isError: isErrorApartments,
    error: errorApartments,
  } = api.resident.getOccupiedApartments.useQuery();

  const {
    data: totalContributionData,
    isLoading: isLoadingTotalContributionData,
    isError: isErrorTotalContributionData,
    error: errorTotalContributionData,
  } = api.fee.getTotalContributionFee.useQuery();
  const { currentMonthTotal = 0, percentageChange = 0, allTimeTotal = 0 } =
    totalContributionData || {};

  const {
    data: totalUnpaidFees,
    isLoading: isLoadingTotalUnpaidFees,
    isError: isErrorTotalUnpaidFees,
    error: errorTotalUnpaidFees,
  } = api.fee.getTotalUnpaidFees.useQuery();

  const {
    data: apartmentsWithUnpaidFees = [],
  } = api.fee.getUnpaidFees.useQuery();

  const {
    data: recentPayments,
    isLoading: isLoadingRecentPayments,
    isError: isErrorRecentPayments,
    error: errorRecentPayments,
  } = api.fee.getRecentPayments.useQuery();

  const handleViewApartments = () => {
    setIsApartmentModalOpen(true);
  };
  const handleViewUnpaidFees = () => {
    setIsUnpaidFeesModalOpen(true);
  };
  const handleViewResidents = () => {
    setIsResidentModalOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">Tổng quan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Khoản thu các tháng</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 justify-center">
        <Card className="col-span-1 mx-auto w-full max-w-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thông tin cư dân</CardTitle>
            <Users className="text-green-200 h-4 w-4 " />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoadingResidentCount ? (
                <Loading />
              ) : isErrorResidentCount ? (
                <div className="text-2xl font-bold">Error: {errorResidentCount.message}</div>
              ) : (
                <div className="text-2xl font-bold">{residentCount}</div>
              )}
              <Button size="sm" onClick={handleViewResidents}>
                Chi tiết
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 mx-auto w-full max-w-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phí chưa thu</CardTitle>
            <AlertOctagonIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoadingTotalUnpaidFees ? (
                <Loading />
              ) : isErrorTotalUnpaidFees ? (
                <div className="text-2xl font-bold">Error: {errorTotalUnpaidFees.message}</div>
              ) : (
                <div className="text-2xl font-bold">
                  {totalUnpaidFees
                    ? totalUnpaidFees.toLocaleString("vi-VN") + "₫"
                    : "Không có phí quá hạn"}
                </div>
              )}
              <Button size="sm" onClick={handleViewUnpaidFees}>
                Chi tiết
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 mx-auto w-full max-w-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Căn hộ đang có cư trú</CardTitle>
            <Warehouse className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoadingApartments ? (
                <Loading />
              ) : isErrorApartments ? (
                <div className="text-2xl font-bold">Error: {errorApartments.message}</div>
              ) : (
                <div className="text-2xl font-bold">{occupiedApartments.count ?? 0}</div>
              )}
              <Button size="sm" onClick={handleViewApartments}>
                Chi tiết
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 mx-auto w-full max-w-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đóng góp tháng {format(new Date(), "MM/yyyy")}
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            {isLoadingTotalContributionData ? (
              <Loading />
            ) : isErrorTotalContributionData ? (
              <div className="text-2xl font-bold">Error: {errorTotalContributionData.message}</div>
            ) : (
              <div className="text-2xl font-bold">
                {currentMonthTotal.toLocaleString("vi-VN")}₫
                <p className="text-xs font-normal text-muted-foreground">
                  {percentageChange >= 0 ? "+" : ""}
                  {percentageChange.toFixed(1)}% so với tháng trước
                </p>
                <p className="text-xs font-normal text-muted-foreground">
                  Tổng phí đóng góp: {allTimeTotal.toLocaleString("vi-VN")}₫
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-2 grid-cols-1 justify-center">
        <Card className="col-span-1">
          <CardHeader className="relative flex flex-row items-start justify-between">
            <div>
              <CardTitle>Thanh toán gần đây</CardTitle>
              <CardDescription>
                Chung cư BlueMoon có {recentPayments ? recentPayments.length : 0} thanh toán mới
              </CardDescription>
            </div>
            <Receipt className="absolute top-7 right-10 h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoadingRecentPayments ? (
              <Loading />
            ) : isErrorRecentPayments ? (
              <div className="text-2xl font-bold">Error: {errorRecentPayments.message}</div>
            ) : (
              <RecentPayments payments={recentPayments || []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ApartmentModal
        isOpen={isApartmentModalOpen}
        onClose={() => setIsApartmentModalOpen(false)}
        apartmentList={occupiedApartments?.apartments ?? []}
      />
      <UnpaidFeesModal
        isOpen={isUnpaidFeesModalOpen}
        onClose={() => setIsUnpaidFeesModalOpen(false)}
        apartmentList={apartmentsWithUnpaidFees.map(apartment => ({
          ...apartment,
          unpaidFees: apartment.unpaidFees || [],
        }))}
      />
      <ResidentModal
        isOpen={isResidentModalOpen}
        onClose={() => setIsResidentModalOpen(false)}
        residentList={occupiedApartments?.apartments.flatMap(apartment => apartment.residents) ?? []}
      />
    </div>
  );
};

export default Dashboard;
