const advancedResults = (model, populate) => async(req, res, next) => {
    	// SOME ADVANCED QUERYING
	
		let query;		

		// Spread this into object
		let queryS = {...req.query};

		// Remove string
		const removeString = ['select', 'sort', 'page', 'limit'];

		// Remove removeString from queryStr
		removeString.forEach(param => delete queryS[param]);

		// Get the query in a string form
		let queryStr = JSON.stringify(queryS);

		// Then replace the shit you don't want...
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);


		query = model.find(JSON.parse(queryStr)); 

		if(req.query.select)
		{
			const fields = req.query.select.split(',').join(' ');
			query = query.select(fields);
		}

		if(req.query.sort){
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		}else{
			query = query.sort('-createdAt');
		}

		// Page and limit
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 100;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const total = await model.countDocuments();

		query = query.skip(startIndex).limit(limit);

        if(populate){
            query = query.populate(populate);
        }

        

		// Execute the query
		const results = await query;


		// I want to show the pagination in object I am sending
		const pagination = {};

		if(endIndex < total){
			pagination.next = {
				page : page + 1,
				limit
			}
		}

		if(startIndex > 0)
		{
			pagination.prev = {
				page : page-1,
				limit
			}
        }
        

        res.advancedResults = {
            success : true,
            count : results.length,
            pagination,
            data : results
        }

        next();
}


module.exports = advancedResults;