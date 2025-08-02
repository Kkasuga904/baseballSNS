/**
 * calendarExport.js - カレンダー連携ユーティリティ
 * 
 * 練習予定や試合予定を携帯のカレンダーアプリに連携するための
 * iCalendar（.ics）ファイル生成機能を提供します。
 */

/**
 * iCalendarイベントを生成
 * @param {Object} schedule - スケジュールオブジェクト
 * @returns {string} iCalendar形式の文字列
 */
function createICalEvent(schedule) {
  const {
    title,
    date,
    startTime = '09:00',
    endTime = '12:00',
    location = '',
    description = '',
    type = 'practice'
  } = schedule;

  // 日付と時刻を結合してiCalendar形式に変換
  const startDateTime = formatICalDateTime(date, startTime);
  const endDateTime = formatICalDateTime(date, endTime);
  
  // ユニークIDの生成
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@baselog.jp`;
  
  // 現在時刻（作成日時）
  const now = formatICalDateTime(new Date().toISOString().split('T')[0], new Date().toTimeString().substr(0, 5));
  
  // アラーム設定（開始1時間前）
  const alarm = type === 'game' ? 
    'BEGIN:VALARM\r\n' +
    'TRIGGER:-PT1H\r\n' +
    'ACTION:DISPLAY\r\n' +
    'DESCRIPTION:試合開始1時間前です\r\n' +
    'END:VALARM\r\n' : '';

  // iCalendar形式のイベント
  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BaseLog//Baseball Schedule//JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:${escapeICalText(title)}`,
    location ? `LOCATION:${escapeICalText(location)}` : '',
    description ? `DESCRIPTION:${escapeICalText(description)}` : '',
    'STATUS:CONFIRMED',
    alarm,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(line => line).join('\r\n');

  return event;
}

/**
 * 複数のスケジュールを含むiCalendarファイルを生成
 * @param {Array} schedules - スケジュールの配列
 * @returns {string} iCalendar形式の文字列
 */
function createICalFile(schedules) {
  if (!schedules || schedules.length === 0) return '';

  const events = schedules.map(schedule => {
    const {
      title,
      date,
      startTime = '09:00',
      endTime = '12:00',
      location = '',
      description = '',
      type = 'practice'
    } = schedule;

    const startDateTime = formatICalDateTime(date, startTime);
    const endDateTime = formatICalDateTime(date, endTime);
    const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@baselog.jp`;
    const now = formatICalDateTime(new Date().toISOString().split('T')[0], new Date().toTimeString().substr(0, 5));
    
    const alarm = type === 'game' ? 
      'BEGIN:VALARM\r\n' +
      'TRIGGER:-PT1H\r\n' +
      'ACTION:DISPLAY\r\n' +
      'DESCRIPTION:試合開始1時間前です\r\n' +
      'END:VALARM\r\n' : '';

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${escapeICalText(title)}`,
      location ? `LOCATION:${escapeICalText(location)}` : '',
      description ? `DESCRIPTION:${escapeICalText(description)}` : '',
      'STATUS:CONFIRMED',
      alarm,
      'END:VEVENT'
    ].filter(line => line).join('\r\n');
  });

  const calendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BaseLog//Baseball Schedule//JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:BaseLog 野球予定',
    'X-WR-TIMEZONE:Asia/Tokyo',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');

  return calendar;
}

/**
 * 日付と時刻をiCalendar形式に変換
 * @param {string} date - YYYY-MM-DD形式の日付
 * @param {string} time - HH:MM形式の時刻
 * @returns {string} YYYYMMDDTHHMMSSZormat
 */
function formatICalDateTime(date, time) {
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');
  
  // 日本時間をUTCに変換（JST-9時間）
  const jstDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00+09:00`);
  const utcDate = new Date(jstDate.getTime());
  
  return utcDate.toISOString().replace(/[-:]/g, '').replace('.000', '');
}

/**
 * iCalendarのテキストをエスケープ
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeICalText(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * iCalendarファイルをダウンロード
 * @param {string} icsContent - iCalendar形式の文字列
 * @param {string} filename - ダウンロードファイル名
 */
export function downloadICalFile(icsContent, filename = 'baselog-schedule.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // メモリリークを防ぐためURLを解放
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * 単一のスケジュールをエクスポート
 * @param {Object} schedule - スケジュールオブジェクト
 */
export function exportSingleSchedule(schedule) {
  const icsContent = createICalEvent(schedule);
  const filename = `baselog-${schedule.date}-${schedule.type}.ics`;
  downloadICalFile(icsContent, filename);
}

/**
 * 複数のスケジュールを一括エクスポート
 * @param {Array} schedules - スケジュールの配列
 */
export function exportMultipleSchedules(schedules) {
  const icsContent = createICalFile(schedules);
  downloadICalFile(icsContent, 'baselog-all-schedules.ics');
}

/**
 * 月間スケジュールをエクスポート
 * @param {Array} schedules - スケジュールの配列
 * @param {number} year - 年
 * @param {number} month - 月（0-11）
 */
export function exportMonthlySchedules(schedules, year, month) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  
  const monthlySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate >= monthStart && scheduleDate <= monthEnd;
  });
  
  const icsContent = createICalFile(monthlySchedules);
  const monthStr = String(month + 1).padStart(2, '0');
  downloadICalFile(icsContent, `baselog-${year}-${monthStr}.ics`);
}

/**
 * Googleカレンダーへの追加URL生成
 * @param {Object} schedule - スケジュールオブジェクト
 * @returns {string} GoogleカレンダーのURL
 */
export function createGoogleCalendarUrl(schedule) {
  const {
    title,
    date,
    startTime = '09:00',
    endTime = '12:00',
    location = '',
    description = ''
  } = schedule;

  const startDateTime = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`;
  const endDateTime = `${date.replace(/-/g, '')}T${endTime.replace(':', '')}00`;
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDateTime}/${endDateTime}`,
    details: description,
    location: location,
    ctz: 'Asia/Tokyo'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}