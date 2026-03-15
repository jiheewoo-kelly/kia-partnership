export default function Footer() {
  return (
    <footer className="bg-main text-gray-500">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-sm mb-3">
              한국투자액셀러레이터
            </h3>
            <p className="text-xs leading-relaxed">
              포트폴리오사의 성장을 지원하는
              <br />
              파트너십 프로그램을 운영합니다.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs mb-3">바로가기</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/news" className="hover:text-white transition-colors">
                  소식
                </a>
              </li>
              <li>
                <a href="/perks" className="hover:text-white transition-colors">
                  Perks
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs mb-3">문의</h4>
            <p className="text-xs">partnership@koreainvestment.ac</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center text-gray-600">
          © {new Date().getFullYear()} 한국투자액셀러레이터. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
