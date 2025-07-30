// 食品データベース（100gあたりの栄養素）
export const foodDatabase = {
  // 主食
  'ご飯': { calories: 168, protein: 2.5, carbs: 37.1, fat: 0.3 },
  '白米': { calories: 168, protein: 2.5, carbs: 37.1, fat: 0.3 },
  '玄米': { calories: 165, protein: 2.8, carbs: 35.6, fat: 1.0 },
  'パン': { calories: 264, protein: 9.3, carbs: 46.7, fat: 4.4 },
  '食パン': { calories: 264, protein: 9.3, carbs: 46.7, fat: 4.4 },
  'うどん': { calories: 105, protein: 2.6, carbs: 21.6, fat: 0.4 },
  'そば': { calories: 114, protein: 4.8, carbs: 22.1, fat: 0.7 },
  'パスタ': { calories: 149, protein: 5.8, carbs: 28.4, fat: 0.9 },
  'ラーメン': { calories: 436, protein: 10.7, carbs: 61.3, fat: 16.8 },
  
  // 肉類
  '鶏胸肉': { calories: 108, protein: 22.3, carbs: 0, fat: 1.5 },
  '鶏もも肉': { calories: 200, protein: 16.2, carbs: 0, fat: 14.0 },
  '豚肉': { calories: 216, protein: 19.3, carbs: 0.2, fat: 14.6 },
  '豚ロース': { calories: 263, protein: 19.3, carbs: 0.2, fat: 19.2 },
  '牛肉': { calories: 298, protein: 17.1, carbs: 0.3, fat: 24.9 },
  '牛ロース': { calories: 318, protein: 16.5, carbs: 0.3, fat: 27.5 },
  'ハンバーグ': { calories: 223, protein: 13.3, carbs: 12.3, fat: 13.4 },
  
  // 魚介類
  'サーモン': { calories: 208, protein: 20.4, carbs: 0.1, fat: 13.4 },
  '鮭': { calories: 133, protein: 22.3, carbs: 0.1, fat: 4.1 },
  'マグロ': { calories: 125, protein: 26.4, carbs: 0.1, fat: 1.4 },
  'サバ': { calories: 202, protein: 20.7, carbs: 0.3, fat: 12.1 },
  '鯖': { calories: 202, protein: 20.7, carbs: 0.3, fat: 12.1 },
  
  // 卵・乳製品
  '卵': { calories: 151, protein: 12.3, carbs: 0.3, fat: 10.3 },
  'ゆで卵': { calories: 151, protein: 12.9, carbs: 0.3, fat: 10.0 },
  '牛乳': { calories: 67, protein: 3.3, carbs: 4.8, fat: 3.8 },
  'ヨーグルト': { calories: 62, protein: 3.6, carbs: 4.9, fat: 3.0 },
  'チーズ': { calories: 356, protein: 22.7, carbs: 1.3, fat: 28.5 },
  
  // 野菜
  'サラダ': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.2 },
  'ブロッコリー': { calories: 33, protein: 4.3, carbs: 5.2, fat: 0.5 },
  'ほうれん草': { calories: 20, protein: 2.2, carbs: 3.1, fat: 0.4 },
  'トマト': { calories: 19, protein: 0.7, carbs: 3.9, fat: 0.1 },
  'キャベツ': { calories: 23, protein: 1.3, carbs: 5.2, fat: 0.2 },
  'レタス': { calories: 12, protein: 0.6, carbs: 2.8, fat: 0.1 },
  
  // 豆類・大豆製品
  '納豆': { calories: 200, protein: 16.5, carbs: 12.1, fat: 10.0 },
  '豆腐': { calories: 56, protein: 4.9, carbs: 2.0, fat: 3.0 },
  '味噌汁': { calories: 40, protein: 3.0, carbs: 5.0, fat: 1.0 },
  
  // その他
  'プロテイン': { calories: 373, protein: 82.5, carbs: 7.5, fat: 1.5 },
  'バナナ': { calories: 86, protein: 1.1, carbs: 22.5, fat: 0.2 },
  'オレンジジュース': { calories: 42, protein: 0.7, carbs: 10.0, fat: 0.1 },
  'スポーツドリンク': { calories: 21, protein: 0, carbs: 5.1, fat: 0 }
}

// 食品名から栄養素を検索する関数
export function searchFood(query) {
  const normalizedQuery = query.toLowerCase()
  const results = []
  
  for (const [food, nutrition] of Object.entries(foodDatabase)) {
    if (food.toLowerCase().includes(normalizedQuery)) {
      results.push({ food, ...nutrition })
    }
  }
  
  return results
}

// 複数の食品から合計栄養素を計算
export function calculateTotalNutrition(foods) {
  return foods.reduce((total, food) => {
    const quantity = food.quantity || 100
    const ratio = quantity / 100
    
    return {
      calories: total.calories + (food.calories * ratio),
      protein: total.protein + (food.protein * ratio),
      carbs: total.carbs + (food.carbs * ratio),
      fat: total.fat + (food.fat * ratio)
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
}