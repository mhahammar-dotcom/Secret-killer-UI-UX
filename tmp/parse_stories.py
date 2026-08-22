import re
import json

with open("/tmp/secret-killer-repo/app/src/main/java/com/secretkiller/app/Story.java") as f:
    text = f.read()

catalog_start = text.find("public static ArrayList<Story> catalog() {")
catalog_text = text[catalog_start:]
story_blocks = re.split(r"stories\.add\(", catalog_text)[1:]

all_stories = []

for idx, block in enumerate(story_blocks):
    m = re.search(r'(?:new Story|Story\.builtIn)\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"', block)
    if not m:
        continue
    s_id, s_title, s_desc = m.groups()
    
    m_intro = re.search(r'new StoryIntroduction\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)', block)
    intro = {
        "setting": m_intro.group(1).replace("\\n", "\n"),
        "situation": m_intro.group(2).replace("\\n", "\n"),
        "incident": m_intro.group(3).replace("\\n", "\n"),
        "stakes": m_intro.group(4).replace("\\n", "\n"),
        "objective": m_intro.group(5).replace("\\n", "\n")
    } if m_intro else None

    clues = []
    for cm in re.finditer(r'new Clue\("((?:[^"\\]|\\.)*)"\)', block):
        clues.append(cm.group(1).replace("\\n", "\n"))

    inv_rounds = []
    for rm in re.finditer(r'new InvestigationRound\(\s*(\d+)\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)', block):
        inv_rounds.append({
            "roundNumber": int(rm.group(1)),
            "title": rm.group(2).replace("\\n", "\n"),
            "publicClue": rm.group(3).replace("\\n", "\n"),
            "description": rm.group(4).replace("\\n", "\n"),
            "discussionPrompt": rm.group(5).replace("\\n", "\n")
        })

    m_hints = re.search(r'new String\[\]\s*\{([^}]+)\}', block)
    hints = []
    if m_hints:
        hints = [h.replace("\\n", "\n") for h in re.findall(r'"((?:[^"\\]|\\.)*)"', m_hints.group(1))]

    if block.startswith("Story.builtIn("):
        chars = []
        for cm in re.finditer(r'new StoryCharacter\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*(true|false)\s*\)', block):
            chars.append({
                "name": cm.group(1).replace("\\n", "\n"),
                "profession": cm.group(2).replace("\\n", "\n"),
                "publicIdentity": cm.group(3).replace("\\n", "\n"),
                "knowledge": cm.group(4).replace("\\n", "\n"),
                "guilty": cm.group(5) == "true"
            })
        
        sol_m = re.search(r'new Clue\[\]\{[^}]+\}\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*new InvestigationRound', block)
        solution = sol_m.group(1).replace("\\n", "\n") if sol_m else ""

        all_stories.append({
            "id": s_id,
            "title": s_title,
            "description": s_desc,
            "minPlayers": len(chars),
            "maxPlayers": len(chars),
            "isBuiltInFixed": True,
            "introduction": intro,
            "fixedCharacters": chars,
            "guiltyPool": [c for c in chars if c["guilty"]],
            "innocentPool": [c for c in chars if not c["guilty"]],
            "clues": clues,
            "wrongVoteHints": ["راجعوا الأدلة بعناية.", "لا تتسرعوا في الحكم.", "اسألوا عن التناقضات."],
            "investigationRounds": inv_rounds,
            "solution": solution
        })
    else:
        m_p = re.search(r'new Story\(\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*(\d+),\s*(\d+)', block)
        min_p = int(m_p.group(1)) if m_p else 4
        max_p = int(m_p.group(2)) if m_p else 12

        char_arrays = re.findall(r'new StoryCharacter\[\]\s*\{([^}]+)\}', block)
        guilty_pool = []
        innocent_pool = []
        if len(char_arrays) >= 1:
            for cm in re.finditer(r'new StoryCharacter\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*(true|false)\s*\)', char_arrays[0]):
                guilty_pool.append({
                    "name": cm.group(1).replace("\\n", "\n"),
                    "profession": cm.group(2).replace("\\n", "\n"),
                    "publicIdentity": cm.group(3).replace("\\n", "\n"),
                    "knowledge": cm.group(4).replace("\\n", "\n"),
                    "guilty": cm.group(5) == "true"
                })
        if len(char_arrays) >= 2:
            for cm in re.finditer(r'new StoryCharacter\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*(true|false)\s*\)', char_arrays[1]):
                innocent_pool.append({
                    "name": cm.group(1).replace("\\n", "\n"),
                    "profession": cm.group(2).replace("\\n", "\n"),
                    "publicIdentity": cm.group(3).replace("\\n", "\n"),
                    "knowledge": cm.group(4).replace("\\n", "\n"),
                    "guilty": cm.group(5) == "true"
                })

        all_stories.append({
            "id": s_id,
            "title": s_title,
            "description": s_desc,
            "minPlayers": min_p,
            "maxPlayers": max_p,
            "isBuiltInFixed": False,
            "introduction": intro,
            "guiltyPool": guilty_pool,
            "innocentPool": innocent_pool,
            "clues": clues,
            "wrongVoteHints": hints if hints else ["راجعوا الأدلة بعناية.", "لا تتسرعوا في الحكم.", "اسألوا عن التناقضات."],
            "investigationRounds": inv_rounds,
            "solution": ""
        })

print(f"Total stories parsed: {len(all_stories)}")
with open("/tmp/parsed_stories.json", "w", encoding="utf-8") as out:
    json.dump(all_stories, out, ensure_ascii=False, indent=2)
print("Saved /tmp/parsed_stories.json")
