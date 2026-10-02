/* "Explained simply" sections for Unit 1, in English, Thai and Burmese. */

export const EXPLAIN = {
  '1-1': {
    en: ['Imagine you want to pass a note in class, but you don’t want anyone else to read it. So you make a rule: move every letter 3 steps forward in the alphabet. A becomes D, B becomes E, C becomes F.',
      '“HELLO” turns into “KHOOR”. It looks like nonsense, but your friend knows the rule, so they move each letter 3 steps back and read “HELLO”.',
      'That number 3 is the <b>key</b>. If you know the key, you can read the secret. If you don’t, you just see jumbled letters. A Roman leader called Julius Caesar used this trick over 2,000 years ago.'],
    th: ['ลองนึกว่าเธออยากส่งโน้ตให้เพื่อนในห้อง แต่ไม่อยากให้คนอื่นอ่านออก เลยตั้งกฎว่า เลื่อนตัวอักษรทุกตัวไปข้างหน้า 3 ตัว A กลายเป็น D, B กลายเป็น E, C กลายเป็น F',
      '“HELLO” จะกลายเป็น “KHOOR” ดูเหมือนคำมั่ว ๆ แต่เพื่อนรู้กฎ ก็แค่เลื่อนแต่ละตัวถอยหลัง 3 ตัว แล้วก็อ่านได้ว่า “HELLO”',
      'เลข 3 นั้นคือ <b>กุญแจ</b> (key) ถ้ารู้กุญแจก็อ่านความลับได้ ถ้าไม่รู้ก็เห็นแค่ตัวอักษรที่สับสนวุ่นวาย ผู้นำชาวโรมันชื่อจูเลียส ซีซาร์ ใช้วิธีนี้เมื่อกว่า 2,000 ปีก่อน'],
    my: ['အတန်းထဲမှာ သူငယ်ချင်းကို စာရွက်လေးတစ်ရွက် ပေးချင်တယ်၊ ဒါပေမဲ့ တခြားသူ မဖတ်နိုင်စေချင်ဘူး ဆိုပါစို့။ ဒါကြောင့် စည်းမျဉ်းတစ်ခု လုပ်လိုက်တယ် − စာလုံးတိုင်းကို အက္ခရာစဉ်မှာ ၃ နေရာ ရှေ့ကို ရွှေ့မယ်။ A က D ဖြစ်သွားတယ်၊ B က E၊ C က F ဖြစ်သွားတယ်။',
      '“HELLO” က “KHOOR” ဖြစ်သွားတယ်။ အဓိပ္ပာယ်မရှိသလို ထင်ရပေမဲ့ သူငယ်ချင်းက စည်းမျဉ်းကို သိတော့ စာလုံးတစ်လုံးချင်းကို ၃ နေရာ နောက်ပြန်ရွှေ့ပြီး “HELLO” လို့ ဖတ်နိုင်တယ်။',
      'အဲဒီ ဂဏန်း ၃ က <b>သော့</b> (key) ပဲ။ သော့ကို သိရင် လျှို့ဝှက်ချက်ကို ဖတ်နိုင်တယ်။ မသိရင် ရောထွေးနေတဲ့ စာလုံးတွေပဲ မြင်ရမယ်။ ရောမခေါင်းဆောင် ဂျူးလီယပ်စ် ဆီဇာက လွန်ခဲ့တဲ့ နှစ်ပေါင်း ၂,၀၀၀ ကျော်က ဒီနည်းကို သုံးခဲ့တယ်။']
  },
  '1-2': {
    en: ['Now you’re the spy. You find a secret note, but you don’t know the key.',
      'There are only 26 letters, so there are only 25 different keys to try. You can just test them one by one: move back 1, move back 2, and so on, until the note makes sense. Trying every key like this is called <b>brute force</b>.',
      'Here’s another trick. The letter E shows up more than any other letter in English. So if one letter appears again and again in the secret note, it’s probably E in disguise, and that tells you the key.',
      '<b>The lesson:</b> if there are only a few keys, a secret isn’t safe.'],
    th: ['คราวนี้เธอเป็นสายลับ เจอโน้ตลับแต่ไม่รู้กุญแจ',
      'ตัวอักษรภาษาอังกฤษมีแค่ 26 ตัว จึงมีกุญแจที่เป็นไปได้แค่ 25 แบบ ลองทีละอันได้เลย ถอย 1 ตัว ถอย 2 ตัว ไปเรื่อย ๆ จนอ่านรู้เรื่อง การลองกุญแจทุกอันแบบนี้เรียกว่า <b>การลองทุกแบบ</b> (brute force)',
      'อีกเคล็ดลับหนึ่ง ในภาษาอังกฤษ ตัว E ปรากฏบ่อยที่สุด ถ้ามีตัวไหนโผล่ซ้ำเยอะที่สุดในโน้ต ก็น่าจะเป็น E ที่ปลอมตัวมา แล้วเธอก็จะรู้กุญแจ',
      '<b>บทเรียน:</b> ถ้ากุญแจมีน้อยแบบ ความลับก็ไม่ปลอดภัย'],
    my: ['အခု မင်းက သူလျှို ဖြစ်သွားပြီ။ လျှို့ဝှက်စာတစ်စောင် တွေ့တယ်၊ ဒါပေမဲ့ သော့ကို မသိဘူး။',
      'အင်္ဂလိပ်စာလုံး ၂၆ လုံးပဲ ရှိတော့ ဖြစ်နိုင်တဲ့ သော့ ၂၅ မျိုးပဲ ရှိတယ်။ တစ်ခုချင်း စမ်းကြည့်လို့ ရတယ် − ၁ နေရာ နောက်ပြန်၊ ၂ နေရာ နောက်ပြန်... စာက အဓိပ္ပာယ်ရှိလာတဲ့အထိ။ သော့အားလုံးကို ဒီလို လိုက်စမ်းတာကို <b>အကုန်လိုက်စမ်းခြင်း</b> (brute force) လို့ ခေါ်တယ်။',
      'နောက်ထပ် နည်းလမ်းတစ်ခု − အင်္ဂလိပ်စာမှာ E က အများဆုံး ပေါ်တဲ့ စာလုံးပဲ။ လျှို့ဝှက်စာထဲမှာ စာလုံးတစ်လုံးက ထပ်ခါထပ်ခါ ပေါ်နေရင် အဲဒါ ရုပ်ဖျက်ထားတဲ့ E ဖြစ်နိုင်တယ်၊ ပြီးတော့ မင်း သော့ကို သိသွားမယ်။',
      '<b>သင်ခန်းစာ −</b> သော့ အမျိုးအစား နည်းရင် လျှို့ဝှက်ချက်က မလုံခြုံဘူး။']
  },
  '1-3': {
    en: ['Think of a bike lock. With 3 number dials, there are 1,000 possible codes, and a thief could try them all in one afternoon. With more dials, there are more codes, and the thief needs much longer.',
      'Computers make keys out of <b>bits</b>. A bit is like a coin flip: heads or tails. Every time you add one more coin flip, the number of possible keys doubles. With 256 coin flips, there are so many keys that even the fastest computer would need longer than the whole age of the universe to try them all.',
      'A Bitcoin secret key is exactly that big: 256 coin flips. That’s why nobody can guess yours.'],
    enIdea: ['The big idea of Unit 1', 'A secret is only as safe as its key. Small key, easy to crack. Giant key, impossible to guess. Keep your key secret, and you stay in control.'],
    th: ['นึกถึงแม่กุญแจล็อกจักรยาน ถ้ามีวงหมุนตัวเลข 3 วง จะมีรหัสได้ 1,000 แบบ ขโมยลองครบได้ในบ่ายเดียว ยิ่งมีวงหมุนมาก รหัสก็ยิ่งเยอะ ขโมยต้องใช้เวลานานขึ้นอีกมาก',
      'คอมพิวเตอร์สร้างกุญแจจาก <b>บิต</b> (bit) บิตหนึ่งเหมือนการโยนเหรียญ ออกหัวหรือก้อย ทุกครั้งที่เพิ่มการโยนเหรียญอีกหนึ่งครั้ง จำนวนกุญแจที่เป็นไปได้จะเพิ่มเป็นสองเท่า ถ้าโยน 256 ครั้ง กุญแจจะมีมากจนคอมพิวเตอร์ที่เร็วที่สุดต้องใช้เวลานานกว่าอายุของจักรวาลทั้งหมดถึงจะลองครบ',
      'กุญแจลับของบิตคอยน์ใหญ่ขนาดนั้นเลย คือโยนเหรียญ 256 ครั้ง จึงไม่มีใครเดากุญแจของเธอได้'],
    thIdea: ['ใจความสำคัญของหน่วยที่ 1', 'ความลับจะปลอดภัยแค่ไหน ขึ้นอยู่กับกุญแจ กุญแจเล็กก็ถอดง่าย กุญแจใหญ่มหาศาลก็เดาไม่ได้ เก็บกุญแจไว้เป็นความลับ แล้วเธอจะควบคุมทุกอย่างได้เอง'],
    my: ['စက်ဘီးသော့ကို စဉ်းစားကြည့်ပါ။ ဂဏန်းလှည့်ခွက် ၃ ခု ပါရင် ဖြစ်နိုင်တဲ့ ကုဒ် ၁,၀၀၀ ရှိတယ်။ သူခိုးက မွန်းလွဲတစ်ခုတည်းနဲ့ အကုန်စမ်းနိုင်တယ်။ လှည့်ခွက် ပိုများလေ ကုဒ် ပိုများလေ၊ သူခိုး အချိန်ပိုကြာလေ ဖြစ်တယ်။',
      'ကွန်ပျူတာတွေက <b>ဘစ်</b> (bit) တွေနဲ့ သော့ကို လုပ်တယ်။ ဘစ်တစ်ခုက ဒင်္ဂါးပြား လှန်တာနဲ့ တူတယ် − ခေါင်း ဒါမှမဟုတ် ပန်း။ ဒင်္ဂါးလှန်တာ တစ်ကြိမ် ထပ်တိုးတိုင်း ဖြစ်နိုင်တဲ့ သော့ အရေအတွက် နှစ်ဆ ဖြစ်သွားတယ်။ ၂၅၆ ကြိမ် လှန်ရင် သော့တွေ အရမ်းများလွန်းလို့ အမြန်ဆုံး ကွန်ပျူတာတောင် စကြဝဠာရဲ့ သက်တမ်းတစ်ခုလုံးထက် ပိုကြာမှ အကုန်စမ်းလို့ ပြီးမယ်။',
      'Bitcoin ရဲ့ လျှို့ဝှက်သော့က အဲဒီလောက် ကြီးတယ် − ဒင်္ဂါး ၂၅၆ ကြိမ် လှန်တာနဲ့ တူတယ်။ ဒါကြောင့် မင်းရဲ့ သော့ကို ဘယ်သူမှ ခန့်မှန်းလို့ မရဘူး။'],
    myIdea: ['ယူနစ် ၁ ရဲ့ အဓိက အယူအဆ', 'လျှို့ဝှက်ချက်တစ်ခု ဘယ်လောက် လုံခြုံလဲ ဆိုတာ သော့ပေါ်မှာ မူတည်တယ်။ သော့သေးရင် ဖော်ထုတ်ရ လွယ်တယ်။ သော့ကြီးမားရင် ခန့်မှန်းလို့ မရဘူး။ သော့ကို လျှို့ဝှက်ထားပါ၊ ဒါဆို မင်းက ထိန်းချုပ်နိုင်မယ်။']
  }
};
