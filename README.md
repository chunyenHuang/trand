# my-stuff

## Functionality:
User can manage own closets (multiple closets available, like spring, summer...
clothes, dress, wallet, handbags, watches, sunglasses….
picture gallery
category
description with name, brand, price, purchased date, tags, sold?
sort and search
User can make combination and document
combine suite
document on date or events
User can share and follow on other users
timeline based on dress

User can view recommends
weather
trend
fashion
following
random combination of closet
login with Facebook

## Database Structure
Users
id
basic_info
user_posts
[{date: date, post: post, replies: {user_id: user_id, reply: reply}}]
user_combinations
user_closets
name
categories(top, bot, hand, head)
sub-categories(jacket, dress, skirt…)
item
id
name
price
picture
Following Systems:
user_id
following_ids
follower_ids
Message Systems:
id
[userA_id, userB_id...]
[{user_id, date_time, message}]
