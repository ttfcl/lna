// server.js (2024.06 최적화)
// 단기/스윙/장기 전략별 종합점수 + 도넛차트 + 종합코멘트 + 지표별 코멘트 UI

const API_KEY = 'i7SNR4PCjuSPhvZRkagJAQjLRaZUC2aF'; // D5S8TWZ8WXN9BCKS
const STRATEGY = {
  단기: ['MA5','MA10','RSI2','RSI14','StochasticFast','CCI','ATR','VWAP','OBV','MFI'],
  스윙: ['MA20','MA60','Bollinger','MACD','RSI14','StochasticSlow','ADX','OBV','MFI'],
  장기: ['MA120','MA200','MACD','PPO','RSI14','Ichimoku','ROC','OBV']
};

// === 1. 23개 지표 점수/코멘트 함수 세트 ===
const INDICATOR_FULL_SET = [
  // 1. MA5 (단기이동평균선)
  {
    name: "단기이동평균선(MA5)",
    key: "MA5",
    score: (v, close) => {
      if (v == null || close == null) return 0;
      const diff = close - v;
      if (diff > 3) return 100;
      if (diff > 1) return 80;
      if (diff > 0) return 60;
      if (diff > -1) return 40;
      if (diff > -3) return 20;
      return 0;
    },
    comment: (v, close) => {
      if (v == null || close == null) return "단기 이동평균선 정보를 확인할 수 없습니다. 참고용으로만 활용해 주세요.";
      const diff = close - v;
      if (diff > 3) return "가격이 최근 평균보다 많이 높아 단기적으로 상승 흐름이 강합니다. 매수세가 활발하게 들어오는 모습입니다.";
      if (diff > 1) return "가격이 단기 평균선보다 높아 긍정적인 흐름이 이어지고 있습니다. 투자자들의 관심이 높은 상태입니다.";
      if (diff > 0) return "가격이 단기 평균선 위에 있어 무난한 흐름입니다. 특별히 위험 신호는 없습니다.";
      if (diff > -1) return "가격이 단기 평균선 아래로 내려가고 있습니다. 조심해서 움직일 필요가 있습니다.";
      return "가격이 단기 평균선보다 많이 아래에 있어 단기적으로 하락세가 강합니다. 투자에 신중하셔야 합니다.";
    }
  },

  // 2. MA10
  {
    name: "MA10",
    key: "MA10",
    score: (v, close) => {
      if (v == null || close == null) return 0;
      const diff = close - v;
      if (diff > 3) return 100;
      if (diff > 1) return 80;
      if (diff > 0) return 60;
      if (diff > -1) return 40;
      if (diff > -3) return 20;
      return 0;
    },
    comment: (v, close) => {
      if (v == null || close == null) return "10일 이동평균선 데이터가 부족합니다.";
      const diff = close - v;
      if (diff > 3) return "가격이 10일 평균보다 많이 높아 단기 강세가 지속되고 있습니다. 최근 매수세가 강하게 나타나고 있습니다.";
      if (diff > 1) return "가격이 10일 평균보다 높아 단기적으로 좋은 분위기입니다. 상승 흐름이 이어질 수 있습니다.";
      if (diff > 0) return "가격이 10일 평균선 위에 있습니다. 특별한 위험 신호는 보이지 않습니다.";
      if (diff > -1) return "가격이 10일 평균선 아래로 내려가고 있습니다. 조심해서 움직일 필요가 있습니다.";
      return "가격이 10일 평균선보다 많이 아래에 있어 단기적으로 하락세가 강합니다. 투자에 주의해야 합니다.";
    }
  },

  // 3. MA20
  {
    name: "MA20",
    key: "MA20",
    score: (v, close) => {
      if (v == null || close == null) return 0;
      const diff = close - v;
      if (diff > 4) return 100;
      if (diff > 2) return 80;
      if (diff > 0) return 60;
      if (diff > -2) return 40;
      if (diff > -4) return 20;
      return 0;
    },
    comment: (v, close) => {
      if (v == null || close == null) return "중기 이동평균선 데이터가 부족합니다.";
      const diff = close - v;
      if (diff > 4) return "가격이 20일 평균보다 크게 높아 중기적으로 좋은 흐름입니다. 꾸준한 매수세가 이어지고 있습니다.";
      if (diff > 2) return "가격이 중기 평균선보다 높아 긍정적인 분위기입니다. 투자자들의 기대가 반영되고 있습니다.";
      if (diff > 0) return "가격이 중기 평균선 위에 있어 무난한 흐름입니다.";
      if (diff > -2) return "가격이 중기 평균선 아래로 내려가고 있습니다. 신중하게 지켜봐야 합니다.";
      return "가격이 중기 평균선보다 많이 아래에 있어 중기적으로 하락세가 강합니다. 투자에 주의해야 합니다.";
    }
  },

  // 4. MA60
  {
    name: "MA60",
    key: "MA60",
    score: (v, close) => {
      if (v == null || close == null) return 0;
      const diff = close - v;
      if (diff > 8) return 100;
      if (diff > 4) return 80;
      if (diff > 0) return 60;
      if (diff > -4) return 40;
      if (diff > -8) return 20;
      return 0;
    },
    comment: (v, close) => {
      if (v == null || close == null) return "장기 이동평균선 데이터가 부족합니다.";
      const diff = close - v;
      if (diff > 8) return "가격이 60일 평균선보다 훨씬 높아 장기적으로 매우 좋은 흐름입니다. 안정적인 상승세가 이어지고 있습니다.";
      if (diff > 4) return "가격이 장기 평균선보다 높아 긍정적인 신호입니다. 투자자들의 관심이 높아진 모습입니다.";
      if (diff > 0) return "가격이 장기 평균선 위에 있어 무난한 흐름입니다.";
      if (diff > -4) return "가격이 장기 평균선 아래로 내려가고 있습니다. 추세를 지켜봐야 합니다.";
      return "가격이 장기 평균선보다 많이 아래에 있어 장기적으로 하락세가 강합니다. 투자에 신중하셔야 합니다.";
    }
  },

  // 5. MA120
  {
    name: "MA120",
    key: "MA120",
    score: (v, close) => {
      if (v == null || close == null) return 0;
      const diff = close - v;
      if (diff > 12) return 100;
      if (diff > 6) return 80;
      if (diff > 0) return 60;
      if (diff > -6) return 40;
      if (diff > -12) return 20;
      return 0;
    },
    comment: (v, close) => {
      if (v == null || close == null) return "장기(120일) 이동평균선 데이터가 부족합니다.";
      const diff = close - v;
      if (diff > 12) return "가격이 120일 평균선보다 훨씬 높아 장기적으로 매우 강한 흐름입니다. 안정적인 성장세가 이어지고 있습니다.";
      if (diff > 6) return "가격이 장기 평균선보다 높아 긍정적인 신호입니다. 투자자들의 관심이 높아진 모습입니다.";
      if (diff > 0) return "가격이 장기 평균선 위에 있어 무난한 흐름입니다.";
      if (diff > -6) return "가격이 장기 평균선 아래로 내려가고 있습니다. 흐름을 잘 지켜보셔야 합니다.";
      return "가격이 장기 평균선보다 많이 아래에 있어 장기적으로 하락세가 강합니다. 투자에 신중하셔야 합니다.";
    }
  },

  // 6. MA200
  {
    name: "MA200",
    key: "MA200",
    score: (v, close) => {
      if (v == null || close == null) return 0;
      const diff = close - v;
      if (diff > 15) return 100;
      if (diff > 8) return 80;
      if (diff > 0) return 60;
      if (diff > -8) return 40;
      if (diff > -15) return 20;
      return 0;
    },
    comment: (v, close) => {
      if (v == null || close == null) return "장기(200일) 이동평균선 데이터가 부족합니다.";
      const diff = close - v;
      if (diff > 15) return "가격이 200일 평균선보다 많이 높아 장기적으로 매우 강한 상승세입니다. 안정적인 성장 흐름입니다.";
      if (diff > 8) return "가격이 장기 평균선보다 높아 긍정적인 신호입니다. 장기 투자자들도 긍정적으로 바라볼 수 있습니다.";
      if (diff > 0) return "가격이 장기 평균선 위에 있어 무난한 흐름입니다.";
      if (diff > -8) return "가격이 장기 평균선 아래로 내려가고 있습니다. 신중하게 접근해야 합니다.";
      return "가격이 장기 평균선보다 많이 아래에 있어 장기적으로 하락세가 강합니다. 투자에 신중하셔야 합니다.";
    }
  },

  // 7. RSI2
  {
    name: "RSI(2)",
    key: "RSI2",
    score: (v) => {
      if (v == null) return 0;
      if (v > 80) return 0;
      if (v > 70) return 20;
      if (v > 60) return 40;
      if (v > 40) return 60;
      if (v > 20) return 80;
      return 100;
    },
    comment: (v) => {
      if (v == null) return "RSI(2) 데이터가 부족합니다.";
      if (v > 80) return "가격이 단기적으로 너무 많이 올라서 조정이 나올 수 있습니다. 단기 매수세가 과도하게 몰린 상태입니다.";
      if (v > 70) return "가격이 많이 올라 단기적으로 쉬어갈 수 있습니다. 단기 투자에 신중해야 합니다.";
      if (v > 60) return "상승 흐름이 이어지고 있습니다. 긍정적인 분위기입니다.";
      if (v > 40) return "특별한 신호가 없습니다. 안정적인 구간입니다.";
      if (v > 20) return "가격이 많이 내려왔습니다. 단기 반등 가능성이 있습니다.";
      return "과도한 매도세로 단기 반등이 나타날 수 있습니다. 너무 낮은 구간에 진입해 있습니다.";
    }
  },

  // 8. RSI14
  {
    name: "RSI(14)",
    key: "RSI14",
    score: (v) => {
      if (v == null) return 0;
      if (v > 80) return 0;
      if (v > 70) return 20;
      if (v > 60) return 40;
      if (v > 40) return 60;
      if (v > 20) return 80;
      return 100;
    },
    comment: (v) => {
      if (v == null) return "RSI(14) 데이터가 부족합니다.";
      if (v > 80) return "많은 사람이 사들이면서 가격이 과열되어 있습니다. 단기 조정 가능성이 있습니다.";
      if (v > 70) return "매수세가 강한 상태이지만 조정이 있을 수 있습니다.";
      if (v > 60) return "상승 흐름이 이어지고 있습니다. 긍정적인 신호입니다.";
      if (v > 40) return "보통의 움직임입니다. 특별한 신호는 없습니다.";
      if (v > 20) return "가격이 많이 떨어져 저점 매수 기회일 수 있습니다.";
      return "많이 팔려서 가격이 매우 낮아진 상태입니다. 반등 신호가 될 수 있습니다.";
    }
  },

  // 9. MACD
  {
    name: "MACD",
    key: "MACD",
    score: (v) => {
      if (v == null) return 0;
      if (v > 2) return 100;
      if (v > 1) return 80;
      if (v > 0) return 60;
      if (v > -1) return 40;
      if (v > -2) return 20;
      return 0;
    },
    comment: (v) => {
      if (v == null) return "MACD 데이터가 부족합니다.";
      if (v > 2) return "상승 신호가 강하게 나타나고 있습니다. 투자 심리가 매우 좋습니다.";
      if (v > 1) return "상승 흐름이 이어지고 있습니다. 긍정적인 신호입니다.";
      if (v > 0) return "상승 흐름이 나타나고 있지만 강하지는 않습니다. 무난한 구간입니다.";
      if (v > -1) return "하락 흐름이 나타나고 있으니 주의가 필요합니다.";
      return "하락 신호가 강하게 나타나고 있습니다. 투자에 신중해야 합니다.";
    }
  },

  // 10. PPO
  {
    name: "PPO",
    key: "PPO",
    score: (v) => {
      if (v == null) return 0;
      if (v > 1.5) return 100;
      if (v > 1) return 80;
      if (v > 0) return 60;
      if (v > -1) return 40;
      if (v > -1.5) return 20;
      return 0;
    },
    comment: (v) => {
      if (v == null) return "PPO 데이터가 부족합니다.";
      if (v > 1.5) return "상승 신호가 뚜렷하게 나타나고 있습니다. 긍정적인 투자 환경입니다.";
      if (v > 1) return "상승 흐름이 이어지고 있습니다. 무난한 상승 분위기입니다.";
      if (v > 0) return "약한 상승 신호가 있습니다. 참고용으로만 활용해 주세요.";
      if (v > -1) return "하락 흐름이 나타나고 있습니다. 주의가 필요합니다.";
      return "하락 신호가 강하게 나타나고 있습니다. 투자에 신중해야 합니다.";
    }
  },

  // 11. Bollinger Bands (볼린저밴드)
  {
    name: "볼린저밴드",
    key: "Bollinger",
    score: (v, upper, lower) => {
      if (v == null || upper == null || lower == null) return 0;
      if (v > upper) return 100;
      if (v > (upper + lower)/2) return 80;
      if (v > lower) return 60;
      if (v === lower) return 40;
      return 0;
    },
    comment: (v, upper, lower) => {
      if (v == null || upper == null || lower == null) return "볼린저밴드 데이터가 부족합니다.";
      if (v > upper) return "가격이 정상 범위를 벗어나 강한 상승세입니다. 과열 신호이기도 하니 주의가 필요합니다.";
      if (v > (upper + lower)/2) return "가격이 평균선보다 높아 좋은 흐름을 보이고 있습니다. 긍정적인 분위기입니다.";
      if (v > lower) return "가격이 밴드 내에서 움직이고 있습니다. 특별한 신호는 없습니다.";
      if (v === lower) return "가격이 밴드의 하단에 닿았습니다. 하락세가 이어질 수 있으니 주의하세요.";
      return "가격이 정상 범위 아래로 크게 벗어났습니다. 반등 가능성도 있지만 하락세에 주의해야 합니다.";
    }
  },

  // 12. OBV (On Balance Volume, 거래량)
  {
    name: "OBV",
    key: "OBV",
    score: (v) => {
      if (v == null) return 0;
      if (v > 1000000) return 100;
      if (v > 500000) return 80;
      if (v > 0) return 60;
      if (v > -500000) return 40;
      if (v > -1000000) return 20;
      return 0;
    },
    comment: (v) => {
      if (v == null) return "거래량(OBV) 데이터가 부족합니다.";
      if (v > 1000000) return "매수세가 강하게 몰려 거래가 활발하게 이루어지고 있습니다. 투자 심리가 매우 좋습니다.";
      if (v > 500000) return "많은 사람이 주식을 사고 있습니다. 긍정적인 투자 분위기입니다.";
      if (v > 0) return "매수세와 매도세가 균형을 이루고 있습니다. 평범한 거래 흐름입니다.";
      if (v > -500000) return "매도세가 조금씩 늘어나고 있습니다. 투자에 신중해야 합니다.";
      return "매도세가 크게 늘어 투자 심리가 위축되고 있습니다. 주의하세요.";
    }
  },

  // 13. MFI (Money Flow Index, 자금흐름)
  {
    name: "MFI",
    key: "MFI",
    score: (v) => {
      if (v == null) return 0;
      if (v > 80) return 0;
      if (v > 70) return 20;
      if (v > 60) return 40;
      if (v > 40) return 60;
      if (v > 20) return 80;
      return 100;
    },
    comment: (v) => {
      if (v == null) return "MFI 데이터가 부족합니다.";
      if (v > 80) return "시장에 돈이 너무 많이 몰려 과열된 상태입니다. 단기적으로 조정이 올 수 있습니다.";
      if (v > 70) return "많은 돈이 주식에 들어오고 있습니다. 투자 분위기가 뜨겁습니다.";
      if (v > 60) return "자금이 꾸준히 들어오고 있습니다. 상승 흐름이 이어질 수 있습니다.";
      if (v > 40) return "특별한 자금 유입이나 이탈이 없습니다. 평범한 흐름입니다.";
      if (v > 20) return "주식에서 돈이 조금씩 빠져나가고 있습니다. 투자에 신중해야 합니다.";
      return "자금이 크게 빠져나가 투자 심리가 약화되고 있습니다. 주의가 필요합니다.";
    }
  },

  // 14. CCI
  {
    name: "CCI",
    key: "CCI",
    score: (v) => {
      if (v == null) return 0;
      if (v > 200) return 100;
      if (v > 100) return 80;
      if (v > -100) return 60;
      if (v > -200) return 40;
      return 20;
    },
    comment: (v) => {
      if (v == null) return "CCI 데이터가 부족합니다.";
      if (v > 200) return "가격이 비정상적으로 많이 올라 매우 강한 상승 신호입니다. 단기 조정에는 주의해야 합니다.";
      if (v > 100) return "상승세가 뚜렷하게 이어지고 있습니다. 긍정적인 신호입니다.";
      if (v > -100) return "평범한 움직임을 보이고 있습니다. 특별한 신호는 없습니다.";
      if (v > -200) return "가격이 하락하며 매도세가 있습니다. 신중하게 접근하세요.";
      return "가격이 너무 많이 내려가 지나친 하락 상태입니다. 조만간 반등이 나타날 수도 있습니다.";
    }
  },

  // 15. ADX
  {
    name: "ADX",
    key: "ADX",
    score: (v) => {
      if (v == null) return 0;
      if (v > 40) return 100;
      if (v > 30) return 80;
      if (v > 20) return 60;
      if (v > 10) return 40;
      if (v > 0) return 20;
      return 0;
    },
    comment: (v) => {
      if (v == null) return "ADX 데이터가 부족합니다.";
      if (v > 40) return "매우 강한 방향성이 있습니다. 시장의 힘이 확실하게 느껴집니다.";
      if (v > 30) return "상승 또는 하락의 힘이 꽤 강한 편입니다. 뚜렷한 흐름이 나타나고 있습니다.";
      if (v > 20) return "방향성이 조금씩 보이기 시작합니다. 투자에 참고해볼 수 있습니다.";
      if (v > 10) return "뚜렷한 방향성은 나타나지 않습니다. 아직은 관망하는 것이 좋겠습니다.";
      return "시장에 특별한 힘이 느껴지지 않습니다. 흐름이 약합니다.";
    }
  },

  // 16. DMI
  {
    name: "DMI",
    key: "DMI",
    score: (v) => {
      if (v == null) return 0;
      if (v > 30) return 100;
      if (v > 20) return 80;
      if (v > 10) return 60;
      if (v > 5) return 40;
      if (v > 0) return 20;
      return 0;
    },
    comment: (v) => {
      if (v == null) return "DMI 데이터가 부족합니다.";
      if (v > 30) return "시장 흐름이 매우 뚜렷합니다. 강한 추세가 형성되어 있습니다.";
      if (v > 20) return "방향성이 점점 강해지고 있습니다. 투자에 참고해보세요.";
      if (v > 10) return "방향성은 아직 약한 편입니다. 좀 더 지켜보는 것이 좋겠습니다.";
      if (v > 5) return "뚜렷한 신호가 없습니다. 아직 관망이 필요합니다.";
      return "특별한 흐름이 나타나지 않고 있습니다.";
    }
  },

  // 17. ROC (Rate of Change)
  {
    name: "ROC",
    key: "ROC",
    score: (v) => {
      if (v == null) return 0;
      if (v > 10) return 100;
      if (v > 5) return 80;
      if (v > 0) return 60;
      if (v > -5) return 40;
      if (v > -10) return 20;
      return 0;
    },
    comment: (v) => {
      if (v == null) return "ROC 데이터가 부족합니다.";
      if (v > 10) return "가격이 빠르게 오르고 있어 강한 상승 신호입니다. 투자자들의 기대가 큽니다.";
      if (v > 5) return "상승 속도가 점점 빨라지고 있습니다. 긍정적인 분위기입니다.";
      if (v > 0) return "가격이 조금씩 오르고 있습니다. 상승 흐름이 무난하게 이어집니다.";
      if (v > -5) return "가격이 약간 하락하고 있습니다. 변동성이 커질 수 있으니 주의하세요.";
      return "가격이 빠르게 하락하고 있습니다. 투자에 신중하셔야 합니다.";
    }
  },

  // 18. Ichimoku
  {
    name: "일목균형표",
    key: "Ichimoku",
    score: (v, close) => {
      if (!v || close == null) return 0;
      // v: {base, conversion}
      if (close > v.base && close > v.conversion) return 100;
      if (close > v.base) return 80;
      if (close > v.conversion) return 60;
      if (close < v.base && close < v.conversion) return 20;
      return 40;
    },
    comment: (v, close) => {
      if (!v || close == null) return "일목균형표 데이터가 부족합니다.";
      if (close > v.base && close > v.conversion) return "현재 가격이 모든 기준선 위에 있습니다. 전반적으로 상승세가 강합니다.";
      if (close > v.base) return "가격이 기준선 위에 있어 상승 흐름을 기대할 수 있습니다.";
      if (close > v.conversion) return "변곡점 부근에서 움직이고 있습니다. 추세를 더 확인하는 것이 좋겠습니다.";
      if (close < v.base && close < v.conversion) return "모든 기준선 아래로 떨어져 약세가 뚜렷합니다. 투자에 주의하세요.";
      return "방향성 신호가 약해 아직은 관망이 필요합니다.";
    }
  },

  // 19. Stochastic Fast
  {
    name: "Stochastics fast",
    key: "StochasticFast",
    score: (v) => {
      if (v == null) return 0;
      if (v > 90) return 0;
      if (v > 80) return 20;
      if (v > 70) return 40;
      if (v > 30) return 60;
      if (v > 10) return 80;
      return 100;
    },
    comment: (v) => {
      if (v == null) return "Stochastics fast 데이터가 부족합니다.";
      if (v > 90) return "매수세가 너무 몰려 잠시 쉬어갈 수 있습니다. 단기 과열 신호입니다.";
      if (v > 80) return "단기적으로 매수세가 강해졌습니다. 조정이 있을 수 있습니다.";
      if (v > 70) return "상승 흐름이 이어지고 있습니다. 긍정적인 신호입니다.";
      if (v > 30) return "특별한 신호는 없습니다. 평범한 흐름입니다.";
      if (v > 10) return "저점에서 반등 신호가 나타날 수 있습니다. 투자자들의 관심이 필요합니다.";
      return "매도세가 너무 강하게 몰리고 있습니다. 반등을 기대해볼 수 있습니다.";
    }
  },

  // 20. Stochastic Slow
  {
    name: "Stochastics slow",
    key: "StochasticSlow",
    score: (v) => {
      if (v == null) return 0;
      if (v > 90) return 0;
      if (v > 80) return 20;
      if (v > 70) return 40;
      if (v > 30) return 60;
      if (v > 10) return 80;
      return 100;
    },
    comment: (v) => {
      if (v == null) return "Stochastics slow 데이터가 부족합니다.";
      if (v > 90) return "중기적으로 과열된 상태입니다. 잠시 쉬어갈 수 있습니다.";
      if (v > 80) return "매수세가 강한 상태입니다. 조정에 유의하세요.";
      if (v > 70) return "상승 흐름이 꾸준히 이어지고 있습니다.";
      if (v > 30) return "특별한 신호는 없습니다. 중립적인 흐름입니다.";
      if (v > 10) return "저점 부근에서 움직이고 있습니다. 반등이 기대됩니다.";
      return "매도세가 강하게 몰리고 있어 조만간 반등을 기대할 수 있습니다.";
    }
  },

  // 21. ATR (Average True Range)
  {
    name: "ATR(변동성)",
    key: "ATR",
    score: (v) => {
      if (v == null) return 0;
      if (v > 4) return 0;
      if (v > 3) return 20;
      if (v > 2) return 40;
      if (v > 1) return 60;
      if (v > 0.5) return 80;
      return 100;
    },
    comment: (v) => {
      if (v == null) return "변동성(ATR) 데이터가 부족합니다.";
      if (v > 4) return "가격이 크게 출렁이고 있습니다. 단기 투자에 매우 위험할 수 있습니다.";
      if (v > 3) return "변동폭이 커 조심해야 할 시기입니다. 급등락에 유의하세요.";
      if (v > 2) return "가격 변동이 제법 큽니다. 신중한 접근이 필요합니다.";
      if (v > 1) return "평균적인 움직임을 보이고 있습니다. 무난한 구간입니다.";
      if (v > 0.5) return "변동폭이 크지 않아 안정적인 흐름입니다. 비교적 안전한 투자 환경입니다.";
      return "매우 안정적인 움직임을 보이고 있습니다. 위험 부담이 적습니다.";
    }
  },

  // 22. VWAP
  {
    name: "VWAP",
    key: "VWAP",
    score: (v, close) => {
      if (v == null || close == null) return 0;
      const diff = close - v;
      if (diff > 2) return 100;
      if (diff > 1) return 80;
      if (diff > 0) return 60;
      if (diff > -1) return 40;
      if (diff > -2) return 20;
      return 0;
    },
    comment: (v, close) => {
      if (v == null || close == null) return "VWAP 데이터가 부족합니다.";
      const diff = close - v;
      if (diff > 2) return "가격이 거래 평균보다 많이 위에 있어 상승세가 강합니다. 많은 사람이 사는 흐름입니다.";
      if (diff > 1) return "가격이 거래 평균보다 높아 투자 분위기가 좋습니다.";
      if (diff > 0) return "가격이 거래 평균선 위에 있어 무난한 상승 흐름입니다.";
      if (diff > -1) return "가격이 거래 평균선 근처에 있습니다. 방향성 파악이 필요합니다.";
      return "가격이 거래 평균보다 아래에 있어 투자 심리가 약한 상태입니다. 조심하세요.";
    }
  },

  // 23. DMI (중복 방지용, DMI+ADX 구분 가능)
  {
    name: "DMI(보조지표)",
    key: "DMI",
    score: (v) => {
      if (v == null) return 0;
      if (v > 30) return 100;
      if (v > 20) return 80;
      if (v > 10) return 60;
      if (v > 5) return 40;
      if (v > 0) return 20;
      return 0;
    },
    comment: (v) => {
      if (v == null) return "DMI 데이터가 부족합니다.";
      if (v > 30) return "시장 흐름이 매우 뚜렷합니다. 강한 추세가 형성되어 있습니다.";
      if (v > 20) return "방향성이 점점 강해지고 있습니다. 투자에 참고해보세요.";
      if (v > 10) return "방향성은 아직 약한 편입니다. 좀 더 지켜보는 것이 좋겠습니다.";
      if (v > 5) return "뚜렷한 신호가 없습니다. 아직 관망이 필요합니다.";
      return "특별한 흐름이 나타나지 않고 있습니다.";
    }
  }
];

// === 2. 데이터 로딩 ===
function showAlert(message) {
  const alertBox = document.getElementById('alert-box');
  alertBox.innerText = message;
  alertBox.style.display = 'block';
}

function hideAlert() {
  const alertBox = document.getElementById('alert-box');
  alertBox.style.display = 'none';
}


async function fetchData(ticker) {
  hideAlert();

  const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  // FMP API 호출 오류 확인 (예: data.historical이 없거나 빈 배열)
  if (!data.historical || data.historical.length === 0) {
    showAlert("❌ 데이터를 불러오지 못했습니다.");
    throw new Error("데이터를 불러오지 못했습니다.");
  }

  // 날짜순 오름차순 정렬 (기본 내림차순이라면)
  const rows = data.historical.slice().sort((a,b) => new Date(a.date) - new Date(b.date));

  return {
    closes: rows.map(r => parseFloat(r.close)),
    highs: rows.map(r => parseFloat(r.high)),
    lows: rows.map(r => parseFloat(r.low)),
    volumes: rows.map(r => parseFloat(r.volume))
  };
}




// === 3. 지표 계산 ===
function sma(values, period) {
  if (values.length < period) return null;
  let sum = 0;
  for (let i = values.length - period; i < values.length; i++) sum += values[i];
  return sum / period;
}

function ema(values, period) {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let emaPrev = sma(values.slice(0, period), period);
  let emaArr = [emaPrev];
  for (let i = period; i < values.length; i++) {
    emaPrev = values[i] * k + emaPrev * (1 - k);
    emaArr.push(emaPrev);
  }
  return emaArr.at(-1);
}

function rsi(values, period = 14) {
  if (values.length < period + 1) return null;
  let gain = 0, loss = 0;
  for (let i = values.length - period; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff > 0) gain += diff;
    else loss -= diff;
  }
  if (gain + loss === 0) return 50;
  const rs = gain / loss || 0.00001;
  return 100 - (100 / (1 + rs));
}

function macd(values, fast=12, slow=26, signal=9) {
  if (values.length < slow + signal) return null;
  const emaFastArr = [];
  let emaFast = sma(values.slice(0, fast), fast);
  emaFastArr[fast-1] = emaFast;
  for (let i = fast; i < values.length; i++) {
    emaFast = values[i] * (2/(fast+1)) + emaFast * (1-2/(fast+1));
    emaFastArr.push(emaFast);
  }
  const emaSlowArr = [];
  let emaSlow = sma(values.slice(0, slow), slow);
  emaSlowArr[slow-1] = emaSlow;
  for (let i = slow; i < values.length; i++) {
    emaSlow = values[i] * (2/(slow+1)) + emaSlow * (1-2/(slow+1));
    emaSlowArr.push(emaSlow);
  }
  const macdLine = [];
  for (let i = 0; i < emaSlowArr.length; i++) {
    const idx = i + (slow - fast);
    macdLine.push(emaFastArr[idx] - emaSlowArr[i]);
  }
  let signalLine = sma(macdLine.slice(macdLine.length-signal), signal);
  return macdLine.at(-1) - signalLine;
}

function ppo(values, fast=12, slow=26, signal=9) {
  if (values.length < slow + signal) return null;
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  if (!emaSlow || emaSlow === 0) return null;
  return ((emaFast - emaSlow) / emaSlow) * 100;
}

function bollingerBands(values, period=20, stdDev=2) {
  if (values.length < period) return { mid: null, upper: null, lower: null };
  const arr = values.slice(-period);
  const mean = arr.reduce((a,b)=>a+b,0)/period;
  const variance = arr.reduce((a,b)=>a+Math.pow(b-mean,2),0)/period;
  const stdev = Math.sqrt(variance);
  return {
    mid: mean,
    upper: mean + stdev*stdDev,
    lower: mean - stdev*stdDev
  };
}

function obv(closes, volumes) {
  let obv = 0;
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i-1]) obv += volumes[i];
    else if (closes[i] < closes[i-1]) obv -= volumes[i];
  }
  return obv;
}

function mfi(highs, lows, closes, volumes, period=14) {
  if (closes.length < period+1) return null;
  let posMF = 0, negMF = 0;
  for (let i = closes.length-period; i < closes.length; i++) {
    const tp = (highs[i] + lows[i] + closes[i]) / 3;
    const prevTp = (highs[i-1] + lows[i-1] + closes[i-1]) / 3;
    const rawMF = tp * volumes[i];
    if (tp > prevTp) posMF += rawMF;
    else if (tp < prevTp) negMF += rawMF;
  }
  if (negMF === 0) return 100;
  const mfRatio = posMF / negMF;
  return 100 - (100 / (1 + mfRatio));
}

function cci(highs, lows, closes, period=20) {
  if (closes.length < period) return null;
  const arr = [];
  for (let i = closes.length - period; i < closes.length; i++) {
    arr.push((highs[i] + lows[i] + closes[i]) / 3);
  }
  const tp = arr[arr.length - 1];
  const smaTp = arr.reduce((a,b)=>a+b,0)/period;
  const meanDev = arr.reduce((a,b)=>a+Math.abs(b-smaTp),0)/period;
  return (tp - smaTp) / (0.015 * meanDev);
}

function roc(values, period=12) {
  if (values.length < period+1) return null;
  const prev = values[values.length - period - 1];
  if (prev === 0) return null;
  return ((values[values.length-1] - prev) / prev) * 100;
}

function atr(highs, lows, closes, period=14) {
  if (closes.length < period+1) return null;
  const trs = [];
  for (let i = closes.length-period; i < closes.length; i++) {
    trs.push(Math.max(
      highs[i]-lows[i],
      Math.abs(highs[i]-closes[i-1]),
      Math.abs(lows[i]-closes[i-1])
    ));
  }
  return trs.reduce((a,b)=>a+b,0)/period;
}

function vwap(closes, volumes) {
  let cumulativePV = 0, cumulativeV = 0;
  for (let i = 0; i < closes.length; i++) {
    cumulativePV += closes[i] * volumes[i];
    cumulativeV += volumes[i];
  }
  return cumulativeV ? cumulativePV / cumulativeV : null;
}

function stochastic(highs, lows, closes, period=14, signalPeriod=3) {
  if (closes.length < period) return { k: null, d: null };
  const sliceHighs = highs.slice(-period);
  const sliceLows = lows.slice(-period);
  const highestHigh = Math.max(...sliceHighs);
  const lowestLow = Math.min(...sliceLows);
  const close = closes.at(-1);
  const k = ((close - lowestLow) / (highestHigh - lowestLow)) * 100;
  // D는 최근 signalPeriod일간의 K 평균
  // (실전에서는 K값 히스토리 관리, 여기선 단순화)
  return { k, d: k };
}

// === Ichimoku, ADX, DMI는 대충 구조만 보존해둠 ===
// (간이판, 실제 투자 분석엔 더 정교한 공식 필요)
function ichimoku(highs, lows) {
  if (highs.length < 52) return null;
  const conv = (Math.max(...highs.slice(-9)) + Math.min(...lows.slice(-9))) / 2;
  const base = (Math.max(...highs.slice(-26)) + Math.min(...lows.slice(-26))) / 2;
  return { conversion: conv, base: base };
}

function adx(highs, lows, closes, period=14) {
  // 여기선 간단화 (실제 계산은 훨씬 복잡)
  if (highs.length < period+1) return null;
  let sum = 0;
  for (let i = closes.length-period; i < closes.length; i++) {
    sum += Math.abs(highs[i] - lows[i]);
  }
  return sum / period;
}

// DMI: ADX 대용 (실전은 더 정교)
function dmi(highs, lows, closes, period=14) {
  return adx(highs, lows, closes, period); // 임시 동치
}

// === 실제 calcIndicators(data) ===

function calcIndicators(data) {
  return {
    MA5: sma(data.closes, 5),
    MA10: sma(data.closes, 10),
    MA20: sma(data.closes, 20),
    MA60: sma(data.closes, 60),
    MA120: sma(data.closes, 120),
    MA200: sma(data.closes, 200),
    RSI2: rsi(data.closes, 2),
    RSI14: rsi(data.closes, 14),
    MACD: macd(data.closes),
    PPO: ppo(data.closes),
    Bollinger: bollingerBands(data.closes),
    OBV: obv(data.closes, data.volumes),
    MFI: mfi(data.highs, data.lows, data.closes, data.volumes),
    CCI: cci(data.highs, data.lows, data.closes),
    ADX: adx(data.highs, data.lows, data.closes),
    DMI: dmi(data.highs, data.lows, data.closes),
    ROC: roc(data.closes),
    Ichimoku: ichimoku(data.highs, data.lows),
    StochasticFast: stochastic(data.highs, data.lows, data.closes, 14, 3).k,
    StochasticSlow: stochastic(data.highs, data.lows, data.closes, 14, 3).d,
    ATR: atr(data.highs, data.lows, data.closes),
    VWAP: vwap(data.closes, data.volumes)
  };
}


// === 4. 전략별 점수/코멘트/지표코멘트 분석 ===
function getStrategyComment(strategy, score, lackList) {
  let lackMsg = "";
  if (lackList.length)
    lackMsg = `<br><b style="color:#b52d2d">※ 데이터가 부족해 점수에서 제외된 지표: ${lackList.join(", ")}</b>`;

  let desc = "";
  if(score >= 90) desc = `${strategy} 전략에서 거의 모든 신호가 매우 강한 상승 흐름을 보여주고 있습니다. 매수세가 뚜렷하고, 투자 심리도 매우 긍정적입니다. 추가 상승 여력이 크다고 판단되며, 빠른 결정이 필요한 시점입니다. 다만 너무 빠른 상승 후에는 조정도 염두에 두어야 하니 리스크 관리가 필요합니다. 신중한 투자가 필요합니다.`;
  else if(score >= 76) desc = `${strategy} 전략에서 강한 상승 신호가 다수 포착되고 있습니다. 시장 분위기가 긍정적이고, 투자자들도 적극적으로 참여하는 모습입니다. 상승 흐름이 이어질 가능성이 높지만, 일부 변동성에도 대비해야 합니다. 신중하게 분할매수나 추격매수 여부를 검토해 보시기 바랍니다.`;
  else if(score >= 61) desc = `${strategy} 전략에서 우호적인 신호가 많이 나타나고 있습니다. 투자자들의 관심이 높아지며, 긍정적 분위기가 감지됩니다. 하지만 변동성이나 돌발 악재에 대한 대비는 필요합니다. 무리한 진입보다는 신중한 접근을 권장합니다.`;
  else if(score >= 41) desc = `${strategy} 전략에서 상승과 하락 신호가 섞여 혼조세를 보이고 있습니다. 불확실성이 있으니 보수적으로 접근하는 것이 좋겠습니다. 명확한 추세가 나오기 전까지 관망하거나 소액으로 분할 진입을 고려해 보세요. 리스크 관리가 필수입니다.`;
  else if(score >= 21) desc = `${strategy} 전략에서 약세 신호가 더 많이 보입니다. 매수세보다 매도세가 강하며 추가 하락 위험이 있습니다. 지금은 관망이 더 유리할 수 있습니다. 추가 하락에 대비한 방어 전략이 필요합니다.`;
  else desc = `${strategy} 전략에서 매우 부정적인 신호가 반복적으로 나오고 있습니다. 하락세가 강하게 이어지고 있어 진입 시 큰 손실 위험이 있습니다. 반등의 징후가 확인될 때까지 최대한 보수적으로 움직이시기 바랍니다. 불확실성이 크니 리스크 관리에 더욱 신경 써 주세요.`;

  if(desc.split('.').length < 5)
    desc += " 신중한 투자가 필요하며, 시장 상황을 추가로 확인해 주세요. 데이터 부족한 지표가 있다면, 결과 해석에 참고해 주세요.";

  return desc + lackMsg;
}

function analyzeStrategy(strategy, indicatorDefs, indicators, closes) {
  const keys = STRATEGY[strategy];
  let total = 0, cnt = 0, lackList = [];
  let detailHtml = "";

  for (const key of keys) {
    const def = indicatorDefs.find(d => d.key === key);
    let v = indicators[key];
    let score = 0, lack = false;
    if(key === "Bollinger") {
      if (!v || v.mid==null || v.upper==null || v.lower==null) lack = true;
      else score = def.score(closes.at(-1), v.upper, v.lower);
    }
    else if(key === "Ichimoku") {
      if (!v) lack = true;
      else score = def.score(v, closes.at(-1));
    }
    else {
      if (v==null) lack = true;
      else if (key.startsWith("MA") || key==="VWAP") score = def.score(v, closes.at(-1));
      else score = def.score(v);
    }
    if(lack) lackList.push(def.name);
    else { total += score; cnt++; }
    detailHtml += `<li><b>${def.name}</b>: ${lack ? "데이터 부족으로 평가 제외" : def.comment(v, closes.at(-1))}</li>`;
  }
  let finalScore = cnt > 0 ? Math.round(total/cnt) : 0;
  return {
    score: finalScore,
    comment: getStrategyComment(strategy, finalScore, lackList),
    detailHtml
  };
}

// --- 도넛 차트 그리기 ---
let scoreGauges = {};
function drawDonut(id, score, color) {
  const ctx = document.getElementById(id).getContext('2d');
  if (scoreGauges[id]) scoreGauges[id].destroy();
  scoreGauges[id] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [color, "#e7e7e7"],
        borderWidth: 0,
        cutout: "70%"
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
  document.getElementById(id + '-label').innerText = score;
}

// --- 메인 분석 함수 ---
function analyze() {
  const ticker = document.getElementById('ticker').value.trim().toUpperCase();
  if (!ticker) {
    alert("티커를 입력하세요!");
    return;
  }

  const welcome = document.getElementById('welcome-visual');
  const loadingSpinner = document.getElementById('loading-spinner');
  const cardSection = document.querySelector('.card-section');
  const detailsSection = document.querySelector('.details-section');

  if (welcome) welcome.style.display = "none";
  if (cardSection) cardSection.style.display = "none";
  if (detailsSection) detailsSection.style.display = "none";

  if (loadingSpinner) loadingSpinner.style.display = "flex";

  document.getElementById('summary-comment').innerHTML = "";
  document.getElementById('score-label').innerText = ``;
  document.getElementById('score-meta').innerHTML = "";
  document.getElementById('score-recommend').innerHTML = "";

  fetchData(ticker).then(data => {
    if (loadingSpinner) loadingSpinner.style.display = "none";
    if (cardSection) cardSection.style.display = "flex";
    if (detailsSection) detailsSection.style.display = "block";

    const indicators = calcIndicators(data);

    const strategyNames = ["단기", "스윙", "장기"];
    let chartColors = ["#49b6ed", "#44ca6b", "#fc9f54"];
    let html = "";

    let donutHtml = '<div style="display:flex;gap:2.5rem;justify-content:center;margin-bottom:1.2rem">';
    for(let i=0;i<3;i++) {
      donutHtml += `
      <div style="text-align:center;">
        <canvas id="donut${i}" width="110" height="110"></canvas>
        <div id="donut${i}-label" style="font-size:1.7em;margin-top:-70px;font-weight:bold;position:relative;color:#222;"></div>
        <div style="font-size:1.05em;font-weight:bold;margin-top:40px;">${strategyNames[i]}전략</div>
      </div>`;
    }
    donutHtml += "</div>";
    html += donutHtml;

    let scoreArr = [];
    for(let i=0;i<3;i++) {
      const strategy = strategyNames[i];
      const res = analyzeStrategy(strategy, INDICATOR_FULL_SET, indicators, data.closes);
      scoreArr.push(res.score);
      html += `
        <div class="item-comment">
          <div>${strategy}전략 종합 점수: <span style="color:#266bd8">${res.score}점</span></div>
          <div>${res.comment}</div>
          <ul>${res.detailHtml}</ul>
        </div>
      `;
    }
    document.getElementById("summary-comment").innerHTML = html;
    for(let i=0;i<3;i++) {
      drawDonut(`donut${i}`, scoreArr[i], chartColors[i]);
    }
    document.getElementById("score-label").innerText = `전략별 종합점수`;
    document.getElementById("score-meta").innerHTML = `<span style="color:#1c3765;">${ticker} 분석<br>조회일시: ${(new Date()).toLocaleString()}</span>`;
    document.getElementById("score-recommend").innerHTML = "";

  }).catch(e => {
    if (loadingSpinner) loadingSpinner.style.display = "none";
    document.getElementById("summary-comment").innerHTML = `<span style="color:red;">${e.message}</span>`;
    document.getElementById("score-label").innerText = "";
    document.getElementById("score-meta").innerHTML = "";
    document.getElementById("score-recommend").innerHTML = "";
  });
}

window.onload = () => {
  if(document.getElementById('welcome-visual')) document.getElementById('welcome-visual').style.display = "flex";
  if(document.querySelector('.card-section')) document.querySelector('.card-section').style.display = "none";
  if(document.querySelector('.details-section')) document.querySelector('.details-section').style.display = "none";
};

// 1. 화면 블러 처리 함수
function blockPage() {
  // 1) 내용 흐리게(blur) 처리
  document.body.style.filter = "blur(7px)";
  // 2) 블록 오버레이 표시
  document.getElementById('block-overlay').style.display = "block";
  // 4) 강제 리다이렉트 (원한다면 주석 해제)
  location.href = "https://google.com"; // 또는 다른 사이트로 강제 이동
}

// 2. 우클릭/F12/소스보기 단축키 등 방지
document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
document.addEventListener('keydown', function(e) {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) e.preventDefault();
  if (e.ctrlKey && (e.key === "U" || e.key === "u")) e.preventDefault();
});

// 3. 개발자도구 열림 감지 후 바로 차단
(function() {
  let blocked = false;
  const threshold = 160;
  setInterval(function() {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      if (!blocked) {
        location.href = "https://google.com"; // 또는 다른 사이트로 강제 이동
        
        blockPage();
        blocked = true;
      }
    } else {
      blocked = false;
    }
  }, 800);
})();