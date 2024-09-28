Ok so this is just me writing down my thoughts as they come for how the DB should be structured.

# Idea 1
I'm thinking it should be a 2 folders. A server a folder and user folder.

The user folder will have txt files corresponding to users. They would be formatted like the following:
```
quoteServerId;quoteDate;reporterId;quoteContents;
quoteServerId;quoteDate;reporterId;quoteContents;
quoteServerId;quoteDate;reporterId;quoteContents;
quoteServerId;quoteDate;reporterId;quoteContents;
```

Then the server folder will have txt files corresponding to servers. They would be formatted like the following:
```
userId;lineId;
userId;lineId;
userId;lineId;
userId;lineId;
userId;lineId;
userId;lineId;
```
