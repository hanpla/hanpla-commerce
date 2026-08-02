const KakaoIcon = ({ className = "h-5 w-5" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.49.18.483.378.352.157-.103 2.5-1.7 3.52-2.39.53.08 1.07.12 1.612.12 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z" />
    </svg>
  );
};

export default KakaoIcon;
