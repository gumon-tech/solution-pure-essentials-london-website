# Changing a price or a treatment on the website

This guide shows you how to change a price, a treatment time or a treatment name on the
website yourself, safely, using GitHub in your web browser. You do not need to install
anything.

## 1. What this file is

Every treatment, price and time on the website lives in 1 file called `data/services.json`.
When you change that file and save it, the website updates itself in a few minutes.

The file is a long list. Each treatment is 1 block that looks like this:

```json
    {
      "slug": "half_face",
      "name": "Half Face",
      "display_name": null,
      "category": "hifu",
      "status": "live",
      "price_gbp": 280,
      "price_from": false,
      "duration": "1 hr",
      "source": "booking",
      "note": ""
    },
```

We call each block a "row". The words on the left in quotes (such as `"price_gbp"`) are the
labels. The values on the right are what you change.

There is a safety check. Every time the file is saved, the website first checks it. If
something is wrong, the website does not change at all and the old version keeps showing.
A mistake cannot break the live website; it only stops your change from appearing.

## 2. Before you start

- You need a GitHub account that has access to the website repository. The agency adds you
  and sends you the link to the repository page. Keep that link as a bookmark.
- Never share your GitHub password with anyone, including the agency.
- Never paste passwords, phone numbers or client details into ChatGPT or Gemini.
- Change 1 thing at a time. It makes any problem easy to find.

## 3. Change a price, step by step

1. Open the repository page from your bookmark and sign in to GitHub if asked.
2. In the list of folders, click `data`.
3. Click `services.json`.
4. Press the pencil icon near the top right of the file (its label is "Edit this file").
5. Find the treatment. Press Ctrl+F (Windows) or Cmd+F (Mac) and type its name as it
   appears on the website, for example `Half Face`. If the name appears more than once,
   check the `category` line in each row to pick the right one.
6. In that row, find the line that starts with `"price_gbp":`. Change only the number.
   For example, change

   ```
         "price_gbp": 280,
   ```

   to

   ```
         "price_gbp": 290,
   ```

   Keep the comma at the end of the line exactly where it was. Do not add a £ sign,
   quotes, spaces or pence. Type a whole number.
7. Press the green "Commit changes" button near the top right.
8. In the box that opens, write a short message that says what you changed, for example
   `Change Half Face price to 290`.
9. Make sure "Commit directly to the main branch" is selected, then press
   "Commit changes" again.

That is all. Go to section 4 to check it worked.

To change a time instead, use the same steps on the `"duration":` line and keep the quotes,
for example `"duration": "1 hr 15 min",`.

## 4. How to check it worked

1. Go back to the repository page and click the "Actions" tab at the top.
2. The top line in the list is your change, with the message you wrote. Wait until it
   shows a green tick. This usually takes a few minutes.
3. Open https://pel.gumon.io/treatments/ and find the treatment. If you still see the old
   price, refresh the page (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac) after 1 or 2 minutes.

If you see a red cross instead of a green tick, the website did not change and the old price
is still showing. Nothing is broken. To find out why:

1. Click the line with the red cross.
2. Click the box called "build".
3. Click the step called "Validate services.json" (it has a red cross). It opens and shows
   the reason.
4. Read the message, fix the file with the steps in section 3, and commit again. Or copy
   the message and use prompt 6c below.

The 3 most common messages, and what they mean:

| What you did | What the message says | What to do |
|---|---|---|
| Deleted a comma by accident | `JSON syntax error ... Expected ',' or '}' after property value in JSON at position 14788 (line 598 column 7)` | The line number points to the line just after the mistake. Look at the line above it and put the comma back. |
| Wrote the price as `"£290"` | `half_face: price_gbp must be a number or null` | Remove the £ sign and the quotes, so it reads `"price_gbp": 290,` |
| Deleted a whole line from a row | `services[45] (half_face): missing required key "note"` | Put the missing line back. Every row must have all 10 lines. |

The start of the message names the treatment (its `slug`) and the label that is wrong.
The numbers in your message will be different from the examples above.

Important: the check stops broken files, not wrong prices. If you type `2900` instead of
`290`, or `290.5`, the check lets it through and the website shows it. Always look at the
website after the green tick.

## 5. What each label means

| Label | What it means | Should you change it? |
|---|---|---|
| `slug` | The treatment's fixed ID, used in web links. Lowercase, no spaces. | No. Leave it alone. |
| `name` | The treatment name as it came from the old booking system. | Only with the agency. |
| `display_name` | The name to show on the website instead of `name`. `null` means "use `name`". To set one, write it in quotes: `"display_name": "Glycolic Acid Peel",` | Yes. |
| `category` | Which section of the treatments page the row appears in (list below). | No, unless the agency agrees. |
| `status` | `"live"` shows on the website. `"held"` and `"review"` never show. | Yes, to hide a treatment (see below). |
| `price_gbp` | The price in pounds. A whole number with no £ sign and no quotes, or `null` for no price. With `null` the website shows "Ask for a quote". | Yes. |
| `price_from` | `true` shows "From" before the price (for example "From £350"). `false` shows the price alone. No quotes. | Yes, if needed. |
| `duration` | The treatment time shown under the name, in quotes, for example `"1 hr 30 min"`. `null` shows no time. | Yes. |
| `source` | Where the row came from (the old booking system or an old web page). The website uses it to avoid showing the same treatment twice. | No. Leave it alone. |
| `note` | A private working note. It is never shown on the website. | You may add a note in quotes. |

The 11 categories:

| Category ID | Section title on the website |
|---|---|
| `hifu` | HIFU face and neck |
| `laser` | Laser and IPL skin treatments |
| `skin` | Microneedling, radio frequency and peels |
| `skinboosters` | Skin boosters and dermal fillers |
| `carboxy` | Carboxy therapy |
| `body` | Body contouring |
| `hair` | Laser and IPL hair removal |
| `facials` | Facials |
| `massage` | Massage |
| `waxing-ladies` | Waxing, ladies |
| `waxing-men` | Waxing, men |

Rows with `"status": "held"` use the category `"held"`. These are treatments that are not
on the website yet.

About `status`:

- To hide a treatment, change `"live"` to `"review"`. This is always safe.
- To show a hidden treatment again, ask the agency first. A row with category `"held"`
  passes the check if you set it to `"live"`, but it still does not appear on the treatments
  page, because it has no section. The agency will give it the right category.

## 6. Ready prompts for ChatGPT or Gemini

You can ask ChatGPT or Gemini to help with the text. Only ever paste 1 row (the block from
`{` to `},`), never the whole file. Always check the answer before you paste it into GitHub:
the assistant can make mistakes.

### 6a. Change a price

Paste this text, then change the name and the price in the first line:

```text
I want to change the price of the treatment named "Half Face" to 290.

Below is 1 row from a JSON file. Change only the number after "price_gbp".
Rules:
- Return only this 1 row, in a code block, and nothing else.
- Keep every key, every quote, every comma and the same order exactly as they are.
- Do not add any key and do not remove any key.
- The price must be a whole number with no £ sign and no quotes.
- Do not change any other value. Do not invent prices or treatments.
- Do not remove this row.

Here is the row:
```

After it, paste the row you copied from GitHub (from `{` to `},`). Then, in GitHub, select
that same row and replace it with the answer.

### 6b. Add a new treatment

Paste this text, then fill in the 4 lines at the top:

```text
I want to add a new treatment to a JSON price list.
Treatment name: [write the name]
Price in pounds: [write a whole number, or write "no price"]
Time: [for example 45 min]
Section: [one of: hifu, laser, skin, skinboosters, carboxy, body, hair, facials, massage, waxing-ladies, waxing-men]

Below is 1 example row from the file. Write 1 new row for the treatment above.
Rules:
- Use exactly the same 10 keys in exactly the same order as the example row. Do not add or remove any key.
- "slug": make a new one from the treatment name, using only lowercase letters, numbers and underscores (for example "hydra_glow_facial").
- "name": the treatment name I gave.
- "display_name": null
- "category": the section I gave, exactly as written.
- "status": "review"
- "price_gbp": the price as a whole number with no £ sign and no quotes, or null if I wrote "no price".
- "price_from": false
- "duration": the time I gave, in quotes.
- "source": "clinic"
- "note": "added by the clinic, waiting for agency check"
- Return only the new row in a code block, ending with "},". Nothing else.
- Do not invent prices, times or treatments. Use only what I gave. Do not remove or change the example row.

Here is the example row:
```

After it, paste any 1 row copied from GitHub as the example.

Then in GitHub:

1. Press Ctrl+F or Cmd+F and search for the new slug (the value after `"slug":` in the
   answer). If it is found, the slug is already used: ask the assistant for a different one.
   The check refuses 2 rows with the same slug.
2. Find a row that is not the last one in the file. Click at the end of its closing line,
   which looks exactly like `    },`
3. Press Enter and paste the new row.
4. Commit as in section 3, with a message such as `Add Hydra Glow Facial for review`.

The new row has `"status": "review"`, so it does not appear on the website. Message the
agency; they check it and make it live.

### 6c. The website did not update

Paste this text, then paste the message from the red "Validate services.json" step
(section 4):

```text
I edited a JSON price list file on GitHub and the website check failed.
Below is the error message.
Please:
- Explain in plain, simple English what is wrong.
- Tell me which treatment and which line or label to look at. If the message gives a line number, tell me the mistake is usually on that line or the line just above it.
- Tell me the smallest change that fixes it.
Rules:
- Do not invent prices or treatments.
- Do not tell me to remove any row or any key.
- If you are not sure, say so and tell me to ask the agency.

Here is the error message:
```

If the message names a row, you may also paste that 1 row after the message.

## 7. What never to do

- Never delete a row. To take a treatment off the website, change its `status` to
  `"review"` instead.
- Never change a `slug` that is already on the website. Web links and the reference in WhatsApp messages depend on it.
- Never paste the whole file into ChatGPT or Gemini, and never paste anything private
  (passwords, phone numbers, client details). Paste 1 row only.
- Never edit, rename or delete any other file or folder in the repository.
- Never choose "Create a new branch" when you commit. Always commit directly to the main
  branch, or your change will not reach the website.

## 8. Who to contact

If you are unsure, or the tick stays red after you have tried to fix it, stop and message
the agency on WhatsApp. Tell them which treatment you changed and paste the message you
saw in the red step.
