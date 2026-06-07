// 실제 옷 사진 URL (Unsplash 무료 이미지)
const CLOTHING_IMAGES = {
  // 반팔 티셔츠
  shortShirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format&q=80',
  // 긴팔 티셔츠
  longShirt: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&auto=format&q=80',
  // 가디건
  cardigan: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&h=400&fit=crop&auto=format&q=80',
  // 반바지
  shorts: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&h=400&fit=crop&auto=format&q=80',
  // 긴바지 (청바지)
  longPants: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format&q=80',
  // 슬랙스
  slacks: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&auto=format&q=80',
};

function ClothingImage({ src, alt }) {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          // 이미지 로드 실패 시 배경색으로 대체
          e.target.style.display = 'none';
          e.target.parentElement.style.background = 'rgba(255,255,255,0.1)';
        }}
      />
      {/* 하단 그라디언트 오버레이 */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"/>
    </div>
  );
}

export function ShirtIcon({ type }) {
  if (type === 'short') return <ClothingImage src={CLOTHING_IMAGES.shortShirt} alt="반팔 티셔츠"/>;
  if (type === 'long')  return <ClothingImage src={CLOTHING_IMAGES.longShirt}  alt="긴팔 티셔츠"/>;
  if (type === 'cardigan') return <ClothingImage src={CLOTHING_IMAGES.cardigan} alt="가디건"/>;
  return null;
}

export function PantsIcon({ type }) {
  if (type === 'short')  return <ClothingImage src={CLOTHING_IMAGES.shorts}    alt="반바지"/>;
  if (type === 'long')   return <ClothingImage src={CLOTHING_IMAGES.longPants} alt="긴바지"/>;
  if (type === 'slacks') return <ClothingImage src={CLOTHING_IMAGES.slacks}    alt="슬랙스"/>;
  return null;
}
