import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { HStack, Table } from "@chakra-ui/react";

import { Rating } from "@/components/ui/rating";
import { toaster } from "@/components/ui/toaster";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

import GlobalSearch from "@/components/others/GlobalSearch";
import ShowSpinner from "@/components/others/ShowSpinner";

import {
  fetchMerchantReviews,
  replyToReview,
} from "@/hooks/review/useReview";

const STAR_LABELS = [5, 4, 3, 2, 1];

const MerchantReviews = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [drafts, setDrafts] = useState({});
  const [replying, setReplying] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["merchant-reviews", page],
    queryFn: () => fetchMerchantReviews(page, limit, navigate),
    placeholderData: keepPreviousData,
  });

  const replyMutation = useMutation({
    mutationKey: ["reply-review"],
    mutationFn: ({ customerId, reply }) =>
      replyToReview(customerId, reply, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["merchant-reviews"]);
      toaster.create({
        title: "Success",
        description: "Reply submitted",
        type: "success",
      });
    },
    onError: (err) => {
      toaster.create({
        title: "Error",
        description: err.message || "Failed to submit reply",
        type: "error",
      });
    },
  });

  const submitReply = (index, customerId) => {
    const reply = (drafts[index] || "").trim();
    if (!reply) return;
    setReplying(index);
    replyMutation.mutate(
      { customerId, reply },
      {
        onSettled: () => {
          setReplying(null);
          setDrafts((d) => ({ ...d, [index]: "" }));
        },
      }
    );
  };

  const distribution = data?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const maxCount = Math.max(...Object.values(distribution), 1);

  if (isLoading) return <ShowSpinner />;

  if (isError) {
    return (
      <div className="bg-gray-100 min-h-full min-w-full">
        <GlobalSearch />
        <div className="p-8 text-center text-red-600">
          Error in fetching reviews.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-full min-w-full">
      <GlobalSearch />
      <div className="flex items-center justify-between mx-8 mt-5">
        <h1 className="text-lg font-bold">Reviews</h1>
      </div>

      {/* Summary + distribution */}
      <div className="mx-8 rounded-lg mt-5 p-6 bg-white flex flex-col lg:flex-row gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold">{data?.averageRating || 0}</div>
          <div>
            <Rating
              readOnly
              allowHalf
              defaultValue={data?.averageRating || 0}
              size="lg"
              colorPalette="yellow"
            />
            <div className="text-sm text-gray-500 mt-1">
              {data?.totalReviews || 0} review(s)
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full lg:max-w-sm">
          {STAR_LABELS.map((star) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8 shrink-0">{star} ★</span>
              <div className="flex-1 h-3 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded"
                  style={{
                    width: `${(distribution[star] / maxCount) * 100}%`,
                  }}
                />
              </div>
              <span className="w-8 text-right text-gray-500">
                {distribution[star]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews table */}
      <div className="mx-8 rounded-lg mt-5 p-6 bg-white">
        <Table.Root className="mt-5 z-10" striped interactive>
          <Table.Header>
            <Table.Row>
              {["Customer", "Phone", "Rating", "Review", "Reply"].map(
                (header) => (
                  <Table.ColumnHeader key={header} textAlign="center">
                    {header}
                  </Table.ColumnHeader>
                )
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.reviews?.length ? (
              data.reviews.map((review, index) => (
                <Table.Row key={`${review.customerId}-${index}`}>
                  <Table.Cell textAlign="center">
                    {review.customerName || review.customerId || "Customer"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {review.customerPhone || "-"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Rating
                      readOnly
                      defaultValue={review.rating}
                      size="sm"
                      colorPalette="yellow"
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="left" style={{ maxWidth: 300 }}>
                    {review.review || "-"}
                  </Table.Cell>
                  <Table.Cell textAlign="left" style={{ maxWidth: 260 }}>
                    {review.reply ? (
                      <div>
                        <div>{review.reply}</div>
                        <div className="text-xs text-gray-500">
                          {review.replyDate
                            ? new Date(review.replyDate).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <textarea
                          className="border rounded p-2 text-sm w-full"
                          rows={2}
                          placeholder="Write a reply..."
                          value={drafts[index] || ""}
                          onChange={(e) =>
                            setDrafts((d) => ({ ...d, [index]: e.target.value }))
                          }
                        />
                        <button
                          className="bg-cyan-100 rounded-md px-3 py-1 text-sm font-semibold self-start"
                          disabled={
                            replying === index || !(drafts[index] || "").trim()
                          }
                          onClick={() => submitReply(index, review.customerId)}
                        >
                          {replying === index ? "Sending..." : "Reply"}
                        </button>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row className="h-[70px]">
                <Table.Cell colSpan={5} textAlign="center">
                  No reviews yet.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        {data?.totalReviews > 0 && (
          <PaginationRoot
            count={data.totalReviews}
            page={page}
            pageSize={limit}
            defaultPage={1}
            onPageChange={(e) => setPage(e.page)}
            variant="solid"
            className="py-[50px] flex justify-center"
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        )}
      </div>
    </div>
  );
};

export default MerchantReviews;
