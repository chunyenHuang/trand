# my-stuff
This is a website for people to manage their stuff(mostly stuff in closet) and share their idea with other people.
## Functionality:
### User can manage own closets 
1. multiple closets available, like spring, summer...  
2. picture gallery  
3. category (clothes, dress, wallet, handbags, watches, sunglasses….)  
4. description with name, brand, price, purchased date, tags, sold?  
5. sort and search  

### User can make combination and document  
1. combine suite  
2. document on date or events  
3. User can share and follow on other users  
4. timeline based on dress  

### User can view recommends  
1. weather  
2. trend  
3. fashion  
4. following  
5. random combination of closet  

### Login with Facebook  

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
