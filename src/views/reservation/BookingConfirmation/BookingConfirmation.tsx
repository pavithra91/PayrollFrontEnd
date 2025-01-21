import { useEffect, useRef, useState } from 'react'
import { Container, DoubleSidedImage, IconText } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    confirmReservation,
    getReservationData,
    useAppDispatch,
} from './store'
import { useLocation } from 'react-router-dom'
import useCommon from '@/utils/hooks/useCommon'
import isEmpty from 'lodash/isEmpty'
import Tag from '@/components/ui/Tag'
import classNames from 'classnames'
import {
    HiBadgeCheck,
    HiCheckCircle,
    HiDownload,
    HiHome,
    HiOutlineCalendar,
    HiOutlineCash,
    HiOutlineDocument,
    HiOutlineHome,
    HiOutlineUser,
    HiOutlineUsers,
    HiPhone,
} from 'react-icons/hi'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import { AllBungalowData, getBungalowDataById } from '../Bungalows/store'
import parse from 'html-react-parser'
import Button from '@/components/ui/Button'
import jsPDF from 'jspdf'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

injectReducer('ReservationData', reducer)

type ReservationData = {
    id: number
    companyCode?: number
    epf: number
    bungalowId: number
    reservationCategory: string
    checkInDate: string | Date
    checkOutDate: string | Date
    noOfAdults: number
    noOfChildren: number
    totalPax: number
    contactNumber_1: string
    contactNumber_2?: string
    nicNo?: string
    comment?: string
    createdBy: string
    bookingStatus: string
    bungalowName: string
    reservationCost: number
}

const BookingConfirmation = () => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const { getUserFromLocalStorage } = useCommon()

    const [data, setData] = useState<ReservationData>()
    const [isPending, setIsPending] = useState(false)
    const [bungalowData, setBungalowData] = useState<AllBungalowData>()

    const { notification } = location.state || {}

    useEffect(() => {
        if (notification) {
            const result = dispatch(getReservationData(notification.reference))
            result.then((res) => {
                const reservation: ReservationData =
                    (res?.payload as ReservationData) || []

                setData(reservation)

                if (
                    reservation.bookingStatus !== 'Pending' &&
                    reservation.bookingStatus !== 'Raffle_Winner'
                ) {
                    setIsPending(true)
                } else {
                    setIsPending(false)
                }
            })

            const bungalowResult = dispatch(
                getBungalowDataById(data?.bungalowId || 1)
            )
            bungalowResult.then((res) => {
                const bungalow: AllBungalowData =
                    (res?.payload as AllBungalowData) || []

                setBungalowData(bungalow)
            })
        }
    }, [dispatch, notification])

    type ReservationStatus = {
        label: string
        class: string
    }

    const reservationStatus: Record<string, ReservationStatus> = {
        Pending: {
            label: 'Pending',
            class: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100',
        },
        Confirmed: {
            label: 'Confirmed',
            class: 'text-emerald-600 bg-emerald-100 dark:emerald-amber-100 dark:bg-emerald-500/20',
        },
        Rejected: {
            label: 'Rejected',
            class: 'text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20',
        },
        Cancelled: {
            label: 'Cancelled',
            class: 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20',
        },
        Raffle_Winner: {
            label: 'Raffle_Winner',
            class: 'text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20',
        },
    }

    const openNotification = (
        type: 'success' | 'warning' | 'danger' | 'info',
        title: string,
        message: string
    ) => {
        toast.push(
            <Notification title={title} type={type}>
                {message}
            </Notification>
        )
    }

    const confirmBooking = () => {
        const request = {
            id: data?.id || 0,
            lastUpdateBy: getUserFromLocalStorage().epf,
        }

        dispatch(confirmReservation(request)).then((res) => {
            if (res.payload == 'success') {
                openNotification(
                    'success',
                    'Reservation Confirmed Successfully',
                    'Your reservation has been Confirmed. Thank you for your cooperation.'
                )
            } else {
                openNotification(
                    'danger',
                    'Reservation Confirmation Failed',
                    'We encountered an issue while processing your Confirmation. Please try again later or contact Secretariat function.'
                )
            }
        })
    }

    const generatePDF = () => {
        if (data != undefined && bungalowData != undefined) {
            const pdf = new jsPDF()

            // Add Reservation Header
            pdf.setFontSize(16)
            pdf.text('Reservation Details', 10, 10)
            pdf.setFontSize(12)
            pdf.text(`Reservation Number: #${data.id}`, 10, 20)
            pdf.text(
                `Status: ${reservationStatus[data.bookingStatus || ''].label}`,
                10,
                30
            )

            // Add Booking Details
            pdf.text('Booking Details:', 10, 40)
            pdf.text(`Check-In Date: ${data.checkInDate}`, 10, 50)
            pdf.text(`Check-Out Date: ${data.checkOutDate}`, 10, 60)
            pdf.text(`Booked By: ${data.createdBy}`, 10, 70)
            pdf.text(`Booking Type: ${data.reservationCategory}`, 10, 80)
            pdf.text(
                `No. of Guests: ${data.noOfAdults} Adults, ${data.noOfChildren} Children`,
                10,
                90
            )

            // Add Bungalow Details
            pdf.text('Bungalow Details:', 10, 110)
            pdf.text(`Name: ${bungalowData.bungalowName}`, 10, 120)
            pdf.text(`Contact: ${bungalowData.contactNumber}`, 10, 130)
            pdf.text(`Address: ${bungalowData.address}`, 10, 140)

            // Add Reservation Cost
            pdf.text('Cost:', 10, 160)
            pdf.text(`Amount: ${data.reservationCost}`, 10, 170)

            // Add Additional Information
            pdf.text('Additional Information:', 10, 190)
            const additionalInfo = bungalowData.description.replace(
                /<[^>]+>/g,
                ''
            )
            pdf.text(additionalInfo, 10, 200)

            // Save the PDF
            pdf.save(`reservation-${data.id}.pdf`)
        }
    }

    if (!bungalowData) {
        return <p>Loading bungalow data...</p>
    }

    return (
        <>
            <Container className="h-full">
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="lg:col-span-9">
                                    <div className="flex items-center mb-2">
                                        <h3>
                                            <span>Reservation Number: </span>
                                            <span className="ltr:ml-2 rtl:mr-2">
                                                #{data.id}
                                            </span>
                                        </h3>
                                        <Tag
                                            className={classNames(
                                                'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                                                reservationStatus[
                                                    data.bookingStatus || ''
                                                ].class
                                            )}
                                        >
                                            {
                                                reservationStatus[
                                                    data.bookingStatus || ''
                                                ].label
                                            }
                                        </Tag>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <Button
                                        block
                                        disabled={isPending}
                                        size="sm"
                                        icon={<HiCheckCircle />}
                                        onClick={confirmBooking}
                                    >
                                        Confirm Booking
                                    </Button>
                                </div>
                                <div className="lg:col-span-1">
                                    <Button
                                        block
                                        size="sm"
                                        icon={<HiDownload />}
                                        onClick={generatePDF}
                                    >
                                        Export
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                                <div className="lg:col-span-2">
                                    <Card header="Booking Details">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                            <div className="lg:col-span-1">
                                                <span className="flex items-center ">
                                                    <HiOutlineCalendar className="text-lg" />
                                                    <span className="ltr:ml-1 rtl:mr-1">
                                                        <span className="mb-2 font-semibold opacity-80">
                                                            Check In Date :{' '}
                                                        </span>

                                                        {dayjs(
                                                            data.checkInDate ||
                                                                0
                                                        ).format(
                                                            'ddd DD-MMM-YYYY'
                                                        )}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="lg:col-span-1">
                                                <span className="flex items-center">
                                                    <HiOutlineUser className="text-lg" />
                                                    <span className="ltr:ml-1 rtl:mr-1">
                                                        <span className="mb-2 font-semibold opacity-80">
                                                            Booked By :{' '}
                                                        </span>

                                                        {data.createdBy}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="lg:col-span-1">
                                                <span className="flex items-center mt-4">
                                                    <HiOutlineCalendar className="text-lg" />
                                                    <span className="ltr:ml-1 rtl:mr-1">
                                                        <span className="mb-2 font-semibold opacity-80">
                                                            Check Out Date :{' '}
                                                        </span>

                                                        {dayjs(
                                                            data.checkOutDate ||
                                                                0
                                                        ).format(
                                                            'ddd DD-MMM-YYYY'
                                                        )}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="lg:col-span-1">
                                                <span className="flex items-center mt-4">
                                                    <HiOutlineDocument className="text-lg" />
                                                    <span className="ltr:ml-1 rtl:mr-1">
                                                        <span className="mb-2 font-semibold opacity-80">
                                                            Booking Type :{' '}
                                                        </span>

                                                        {
                                                            data.reservationCategory
                                                        }
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <span className="flex items-center mt-4">
                                            <HiOutlineUsers className="text-lg" />
                                            <span className="ltr:ml-1 rtl:mr-1">
                                                <span className="mb-2 font-semibold opacity-80">
                                                    No of Guests :{' '}
                                                </span>

                                                {data.noOfAdults +
                                                    ' Adults ' +
                                                    data.noOfChildren +
                                                    ' Children '}
                                            </span>
                                        </span>

                                        <span className="flex items-center mt-4">
                                            <HiOutlineHome className="text-lg" />
                                            <span className="ltr:ml-1 rtl:mr-1">
                                                <span className="mb-2 font-semibold opacity-80">
                                                    Bungalow :{' '}
                                                </span>

                                                {data.bungalowName}
                                            </span>
                                        </span>

                                        <hr className="my-5" />
                                        <h6 className="mb-1">Cost</h6>
                                        <span className="flex items-center mt-4">
                                            <HiOutlineCash className="text-lg" />
                                            <span className="ltr:ml-1 rtl:mr-1">
                                                <span className="mb-2 font-semibold opacity-80">
                                                    Amount :{' '}
                                                </span>

                                                {data.reservationCost}
                                            </span>
                                        </span>

                                        <hr className="my-5" />
                                        <h6 className="mb-1">
                                            Additional Information
                                        </h6>
                                        <span className="ltr:ml-1 rtl:mr-1">
                                            <span className="mb-2 font-semibold opacity-80">
                                                {parse(
                                                    bungalowData.description
                                                )}
                                            </span>
                                        </span>
                                    </Card>
                                </div>
                                <div className="lg:col-span-1">
                                    <Card header="Bungalow Details">
                                        <span className="flex items-center">
                                            <DoubleSidedImage
                                                width={350}
                                                src={
                                                    '/img/bungalow/' +
                                                    bungalowData?.id +
                                                    '.jpg'
                                                }
                                                darkModeSrc="/img/others/leave.png"
                                            />
                                        </span>
                                        <hr className="my-5" />
                                        <span className="flex items-center mt-4">
                                            <span className="ltr:ml-1 rtl:mr-1">
                                                <h6 className="mb-4">
                                                    {bungalowData.bungalowName}{' '}
                                                </h6>
                                                {/* <span className="mb-2 font-semibold opacity-80">
                                                    {bungalowData.bungalowName}{' '}
                                                </span> */}
                                            </span>
                                        </span>

                                        <IconText
                                            className="mt-2"
                                            icon={
                                                <HiPhone className="text-xl opacity-70" />
                                            }
                                        >
                                            <span className="font-semibold">
                                                {bungalowData?.contactNumber}
                                            </span>
                                        </IconText>

                                        <IconText
                                            className="mt-4"
                                            icon={
                                                <HiHome className="text-xl opacity-70" />
                                            }
                                        >
                                            <span className="font-semibold">
                                                {bungalowData?.address}
                                            </span>
                                        </IconText>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Container>
        </>
    )
}

export default BookingConfirmation
