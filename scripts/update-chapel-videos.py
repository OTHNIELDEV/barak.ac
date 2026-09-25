#!/usr/bin/env python3
"""
산해원 채플 & 바라크아카데미 주간 자동 설교 업데이트 스크립트
J-HOP TV (@jhoptv) 유튜브 채널에서 계절과 교회력 절기에 맞는 예배 6편, 설교 방송 6편을 수집하여
src/app/chapel/page.tsx를 자동으로 갱신합니다.
"""

import sys
import os
import re
import json
import datetime
import urllib.request
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
CHAPEL_PAGE_PATH = os.path.join(PROJECT_ROOT, "src", "app", "chapel", "page.tsx")

def get_current_season_and_liturgy():
    """현재 날짜를 기반으로 계절 및 교회력 절기 키워드 도출"""
    now = datetime.datetime.now()
    month = now.month
    day = now.day

    season = ""
    liturgy = ""
    keywords = []

    if month in [12, 1, 2]:
        season = "겨울"
        if month == 12:
            liturgy = "대림절 / 성탄절"
            keywords = ["성탄", "빛", "말씀", "오신", "기다림", "소망"]
        elif month == 1 and day <= 15:
            liturgy = "신년 / 주현절"
            keywords = ["새해", "시작", "결단", "말씀", "언약"]
        else:
            liturgy = "연초 영성"
            keywords = ["기도", "말씀", "겸손", "순종"]
    elif month in [3, 4, 5]:
        season = "봄"
        if (month == 3) or (month == 4 and day <= 20):
            liturgy = "사순절 / 부활절"
            keywords = ["율법", "십자가", "부활", "자유", "기도", "구원"]
        else:
            liturgy = "부활절기 / 성령강림절"
            keywords = ["성령", "성신", "약속", "권능", "불", "제자"]
    elif month in [6, 7, 8]:
        season = "여름"
        liturgy = "성령강림 후 / 영적 무장"
        keywords = ["성령", "권능", "영적", "시험", "광야", "승리", "큰사람"]
    else: # 9, 10, 11
        season = "가을"
        if month == 11 and day >= 10:
            liturgy = "추수감사절"
            keywords = ["감사", "결실", "열매", "은혜", "예배"]
        else:
            liturgy = "평신도 영성 / 말씀 결실기"
            keywords = ["말씀", "율법", "기도", "겸손", "지혜", "동역"]

    return {
        "date_str": now.strftime("%Y년 %m월 %d일"),
        "season": season,
        "liturgy": liturgy,
        "keywords": keywords
    }

def fetch_channel_videos():
    """J-HOP TV 채널에서 최근 영상 목록 및 oEmbed 메타데이터 수집"""
    url = "https://www.youtube.com/@jhoptv/videos"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })
    
    try:
        html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8")
    except Exception as e:
        print(f"Error fetching channel: {e}", file=sys.stderr)
        return []

    # videoId 추출 (중복 제거)
    raw_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
    video_ids = list(dict.fromkeys(raw_ids))

    videos = []
    for vid in video_ids[:30]:
        try:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
            o_req = urllib.request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0"})
            res = urllib.request.urlopen(o_req, timeout=8)
            data = json.loads(res.read().decode("utf-8"))
            raw_title = data.get("title", "")
            
            # 파싱: 제목, 본문, 시리즈 분리
            parsed = parse_video_title(raw_title)
            parsed["youtubeId"] = vid
            parsed["thumb"] = f"https://img.youtube.com/vi/{vid}/hqdefault.jpg"
            videos.append(parsed)
        except Exception:
            continue

    return videos

def parse_video_title(raw_title):
    """유튜브 제목 문자열에서 핵심 정보 추출"""
    parts = [p.strip() for p in raw_title.split("|")]
    
    title = parts[0] if parts else raw_title
    speaker = "이갈렙 목사 (제이합미션)"
    scripture = "성경 본문 강해"
    series = "주일 예배"

    # 패턴 파싱
    for p in parts:
        if any(b in p for b in ["창", "출", "레", "민", "신", "수", "삿", "삼", "왕", "대상", "대하", "시", "잠", "사", "렘", "겔", "단", "호", "욜", "암", "마", "막", "눅", "요", "행", "롬", "고전", "고후", "갈", "엡", "빌", "골", "살전", "딤전", "히", "약", "벧전", "계", ":"]):
            if ":" in p or re.search(r'\d+', p):
                scripture = p
        elif "목사" in p or "교수" in p or "학장" in p:
            speaker = p
        elif any(s in p for s in ["큰사람", "성령론", "세미나", "특강", "시리즈", "예배"]):
            series = p

    # 타이틀 정리
    clean_title = re.sub(r'\|\s*.*', '', raw_title).strip()
    clean_title = re.sub(r'#\d+', lambda m: m.group(0), clean_title)

    desc = f"{scripture} 말씀을 중심으로 하나님 나라의 진리와 사역자의 바른 영성을 증거합니다."
    if "성령" in raw_title or "성신" in raw_title:
        desc = "약속하신 성령의 권능과 불의 세례를 사모하며 참된 제자로 거듭나는 성령론 강해입니다."
    elif "율법" in raw_title or "자유" in raw_title:
        desc = "사랑과 긍휼로 율법을 완성하며 성도를 참된 자유로 이끄는 온전한 구속사적 말씀입니다."
    elif "기도" in raw_title:
        desc = "우리의 간구를 항상 들으시는 하나님의 신실하심 속에서 마땅히 품어야 할 기도의 영성입니다."
    elif "시험" in raw_title or "말씀" in raw_title:
        desc = "기록된 말씀의 권세로 원수를 물리치고 하나님의 입에서 나오는 말씀으로 사는 삶을 선포합니다."

    return {
        "title": clean_title,
        "speaker": speaker,
        "scripture": scripture,
        "series": series,
        "desc": desc,
        "raw_title": raw_title
    }

def select_seasonal_videos(videos, season_info):
    """계절과 절기 우선순위에 따라 예배 6개, 설교 방송 6개 선정"""
    if len(videos) < 12:
        print(f"Warning: Only found {len(videos)} videos, need 12. Reusing available.", file=sys.stderr)

    keywords = season_info["keywords"]

    # 점수 계산 (키워드 매칭)
    def score_video(v):
        score = 0
        t = v["raw_title"]
        for kw in keywords:
            if kw in t:
                score += 10
        # '예배' 키워드가 들어간 것은 chapel에 가산점
        return score

    # 정렬
    scored_videos = sorted(videos, key=score_video, reverse=True)

    # 1. 상단 산해원 채플 영상 6개 (예배 실황/말씀 포함)
    chapel_sermons = []
    worship_vids = [v for v in scored_videos if "예배" in v["raw_title"]]
    other_vids = [v for v in scored_videos if "예배" not in v["raw_title"]]

    for v in worship_vids:
        if len(chapel_sermons) < 6 and v not in chapel_sermons:
            chapel_sermons.append(v)
    for v in other_vids:
        if len(chapel_sermons) < 6 and v not in chapel_sermons:
            chapel_sermons.append(v)

    # 2. 하단 설교 방송 6개 ('예배' 표시가 전혀 없는 순수 '말씀' 강해 영상만 엄격히 선정)
    broadcast_sermons = []
    # 제목에 '예배'가 없는 순수 말씀 영상 필터링
    word_only_vids = [v for v in scored_videos if "예배" not in v["raw_title"] and v not in chapel_sermons]
    for v in word_only_vids:
        if len(broadcast_sermons) < 6:
            broadcast_sermons.append(v)

    # 검증된 순수 말씀 영상 Fallback 리스트 (유튜브 채널 공식 '말씀' 시리즈)
    fallback_word_sermons = [
        {
            "title": "생베 조각을 낡은 옷에 깁지 않는다",
            "speaker": "이갈렙 목사 (제이합미션)",
            "scripture": "마태복음 9:14-17",
            "series": "큰집 큰사람 (1)",
            "desc": "복음의 새 포도주를 담는 영적 그릇과 생베 조각의 거룩한 연합의 비밀을 강해합니다.",
            "youtubeId": "YxU9WnNvNP0",
            "thumb": "https://img.youtube.com/vi/YxU9WnNvNP0/hqdefault.jpg",
            "raw_title": "생베 조각을 낡은 옷에 깁지 않는다 | 마 9:14-17 | 큰집 큰사람(1)"
        },
        {
            "title": "모든 말씀으로 살 것이라",
            "speaker": "이갈렙 목사 (제이합미션)",
            "scripture": "마태복음 4:1-11",
            "series": "큰집 큰사람 (2)",
            "desc": "육신의 떡을 넘어 하나님의 입에서 나오는 모든 말씀으로 원수를 이기는 신앙의 삶",
            "youtubeId": "FlYdXHkAK08",
            "thumb": "https://img.youtube.com/vi/FlYdXHkAK08/hqdefault.jpg",
            "raw_title": "모든 말씀으로 살 것이라 | 마 4:1-11 | 큰집 큰사람(2)"
        },
        {
            "title": "다만 주를 섬기라 하였느니라",
            "speaker": "이갈렙 목사 (제이합미션)",
            "scripture": "누가복음 4:1-13",
            "series": "큰집 큰사람 (3)",
            "desc": "오직 주 하나님만을 경외하고 섬김으로 악한 권세를 꺾는 거룩한 성도의 권능",
            "youtubeId": "Du1FyiPPqIQ",
            "thumb": "https://img.youtube.com/vi/Du1FyiPPqIQ/hqdefault.jpg",
            "raw_title": "다만 주를 섬기라 하였느니라 | 눅 4:1-13 | 큰집 큰사람(3)"
        },
        {
            "title": "아버지의 약속하신 것 그대로",
            "speaker": "이갈렙 목사 (제이합미션)",
            "scripture": "사도행전 1:4-5, 요엘 2:28-32",
            "series": "성경성령론 (1)",
            "desc": "약속하신 성령을 기다리며 권능과 성령의 세례를 온전히 사모하는 성경적 성령론 강해",
            "youtubeId": "7c3CMFPsTFA",
            "thumb": "https://img.youtube.com/vi/7c3CMFPsTFA/hqdefault.jpg",
            "raw_title": "아버지의 약속하신 것 그대로 | 행1:4-5 / 욜2:28-32 | 성경성령론(1)"
        },
        {
            "title": "성령, 예루살렘으로부터라야",
            "speaker": "이갈렙 목사 (제이합미션)",
            "scripture": "누가복음 24:45-49, 요엘 2:28-32",
            "series": "성경성령론 (2)",
            "desc": "위로부터 입혀지는 성령의 능력과 예루살렘에서부터 온 땅 끝으로 향하는 구속사적 사명",
            "youtubeId": "2KyVQqoj0HM",
            "thumb": "https://img.youtube.com/vi/2KyVQqoj0HM/hqdefault.jpg",
            "raw_title": "성령, 예루살렘으로부터라야 | 눅 24:45-49/욜 2:28-32 | 성경성령론(2)"
        },
        {
            "title": "필경은 성신을 그의 제자된 자에게",
            "speaker": "이갈렙 목사 (제이합미션)",
            "scripture": "이사야 32:9-15, 사도행전 2:32, 36",
            "series": "성경성령론 (3)",
            "desc": "광야가 아름다운 밭이 되고 주를 주로 시인하는 제자들에게 부어주시는 성령의 충만하심",
            "youtubeId": "SNFWAkc05NY",
            "thumb": "https://img.youtube.com/vi/SNFWAkc05NY/hqdefault.jpg",
            "raw_title": "필경은 성신을 그의 제자된 자에게 | 사 32:9-15 / 행 2:32,36 | 성경성령론(3)"
        }
    ]

    for fb in fallback_word_sermons:
        if len(broadcast_sermons) < 6 and fb["youtubeId"] not in [b["youtubeId"] for b in broadcast_sermons]:
            broadcast_sermons.append(fb)

    return chapel_sermons[:6], broadcast_sermons[:6]

def update_chapel_file(chapel_sermons, broadcast_sermons):
    """src/app/chapel/page.tsx 파일 내 배열 데이터 자동 치환"""
    with open(CHAPEL_PAGE_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # chapelSermons JS 문자열 생성
    chapel_items = []
    for idx, s in enumerate(chapel_sermons, start=1):
        item_str = f"""        {{
            id: {idx},
            title: {json.dumps(s['title'], ensure_ascii=False)},
            speaker: {json.dumps(s['speaker'], ensure_ascii=False)},
            scripture: {json.dumps(s['scripture'], ensure_ascii=False)},
            desc: {json.dumps(s['desc'], ensure_ascii=False)},
            youtubeId: {json.dumps(s['youtubeId'])},
            thumb: {json.dumps(s['thumb'])}
        }}"""
        chapel_items.append(item_str)

    new_chapel_code = "    const chapelSermons = [\n" + ",\n".join(chapel_items) + "\n    ];"

    # broadcastSermons JS 문자열 생성
    broadcast_items = []
    for idx, s in enumerate(broadcast_sermons, start=101):
        item_str = f"""        {{
            id: {idx},
            title: {json.dumps(s['title'], ensure_ascii=False)},
            speaker: {json.dumps(s['speaker'], ensure_ascii=False)},
            scripture: {json.dumps(s['scripture'], ensure_ascii=False)},
            series: {json.dumps(s['series'], ensure_ascii=False)},
            desc: {json.dumps(s['desc'], ensure_ascii=False)},
            youtubeId: {json.dumps(s['youtubeId'])},
            thumb: {json.dumps(s['thumb'])}
        }}"""
        broadcast_items.append(item_str)

    new_broadcast_code = "    const broadcastSermons = [\n" + ",\n".join(broadcast_items) + "\n    ];"

    # 정규식으로 안전하게 교체
    chapel_pattern = r'const chapelSermons = \[\s*[\s\S]*?\n    \];'
    broadcast_pattern = r'const broadcastSermons = \[\s*[\s\S]*?\n    \];'

    if not re.search(chapel_pattern, content):
        print("Error: Could not locate chapelSermons in page.tsx", file=sys.stderr)
        return False
    if not re.search(broadcast_pattern, content):
        print("Error: Could not locate broadcastSermons in page.tsx", file=sys.stderr)
        return False

    content = re.sub(chapel_pattern, new_chapel_code.strip(), content)
    content = re.sub(broadcast_pattern, new_broadcast_code.strip(), content)

    with open(CHAPEL_PAGE_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print("Successfully updated src/app/chapel/page.tsx!")
    return True

def main():
    commit_and_push = "--commit-and-push" in sys.argv

    season_info = get_current_season_and_liturgy()
    print(f"=== [주간 채플 자동 업데이트 시작] ===")
    print(f"기준 일자: {season_info['date_str']} ({season_info['season']} / {season_info['liturgy']})")
    print(f"적용 키워드: {', '.join(season_info['keywords'])}")

    print("\n1. 유튜브 채널(@jhoptv) 최신 영상 수집 중...")
    videos = fetch_channel_videos()
    print(f"-> 총 {len(videos)}개 영상 메타데이터 수집 완료")

    if not videos:
        print("Error: 영상을 가져오지 못했습니다.", file=sys.stderr)
        sys.exit(1)

    print("\n2. 계절과 절기에 맞춘 예배 6편, 설교 방송 6편 선정 중...")
    chapel_sermons, broadcast_sermons = select_seasonal_videos(videos, season_info)

    print(f"-> 예배 설교 6편: {[s['title'] for s in chapel_sermons]}")
    print(f"-> 설교 방송 6편: {[s['title'] for s in broadcast_sermons]}")

    print("\n3. src/app/chapel/page.tsx 업데이트 중...")
    success = update_chapel_file(chapel_sermons, broadcast_sermons)
    if not success:
        sys.exit(1)

    if commit_and_push:
        print("\n4. Git 커밋 및 Vercel 원격 푸시 진행 중...")
        commit_msg = f"chore(chapel): weekly automated sermon update ({season_info['date_str']} - {season_info['liturgy']})"
        subprocess.run(["git", "add", "src/app/chapel/page.tsx"], cwd=PROJECT_ROOT, check=True)
        subprocess.run(["git", "commit", "-m", commit_msg], cwd=PROJECT_ROOT, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=PROJECT_ROOT, check=True)
        print("-> Git 푸시 및 Vercel 자동 배포 트리거 완료!")

    print("\n=== [주간 채플 설교 자동 업데이트 완료] ===")

if __name__ == "__main__":
    main()
