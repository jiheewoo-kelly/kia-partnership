export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-28 text-center">
        <p className="text-blue text-sm font-semibold tracking-[0.3em] uppercase mb-6">
          KOREA INVESTMENT ACCELERATOR
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-main leading-tight mb-6">
          포트폴리오사를 위한
          <br />
          파트너십 프로그램
        </h1>
        <p className="text-gray-400 text-xl max-w-xl mx-auto leading-relaxed mb-12">
          한국투자액셀러레이터의 파트너 네트워크를 통해
          <br className="hidden md:block" />
          클라우드, 마케팅, 법률 등 다양한 혜택을 만나보세요.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/perks"
            className="inline-flex items-center px-8 py-3.5 bg-blue text-white text-base font-semibold rounded-full hover:bg-blue-600 transition-colors"
          >
            Perks 둘러보기
          </a>
          <a
            href="/news"
            className="inline-flex items-center px-8 py-3.5 border border-gray-200 text-main text-base font-medium rounded-full hover:border-blue/40 hover:text-blue transition-colors"
          >
            최신 소식
          </a>
        </div>
      </div>
    </section>
  );
}
