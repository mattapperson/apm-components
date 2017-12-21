export default function getFormattedBuckets(buckets, bucketSize) {
  if (!buckets) {
    return null;
  }

  return buckets.map(({ count, key, transactionId }) => {
    return {
      transactionId,
      x0: key,
      x: key + bucketSize,
      y: count
    };
  });
}
