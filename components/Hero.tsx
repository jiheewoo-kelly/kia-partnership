export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-8 md:pb-10 text-center">
        <p className="text-blue text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 md:mb-6">
          KOREA INVESTMENT ACCELERATOR
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-main leading-tight mb-4 md:mb-6">
          바른동행 포트폴리오사를 위한
          <br />
          A TO Z 성장 지원
        </h1>
        <p className="text-gray-400 text-base md:text-xl max-w-xl mx-auto leading-relaxed mb-8 md:mb-12">
          한국투자액셀러레이터의 차별화된 지원과 네트워크를 통해
          <br className="hidden md:block" />
          스타트업 성장에 필요한 모든 것을 만나보세요.
        </p>
        <div className="flex justify-center gap-3 md:gap-4">
          <a
            href="/perks"
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-3.5 bg-blue text-white text-sm md:text-base font-semibold rounded-full hover:bg-blue-600 transition-colors"
          >
            Perks 둘러보기
          </a>
          <a
            href="/news"
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-3.5 border border-gray-200 text-main text-sm md:text-base font-medium rounded-full hover:border-blue/40 hover:text-blue transition-colors"
          >
            최신 소식
          </a>
        </div>
      </div>
    </section>
  );
}
