import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";






export const fetchHeroSection = createAsyncThunk(
    "hero/fetchSection",
    async () => {
        try {
            const response = await fetch("http://localhost:9000/homepage-sections?section_type=hero");

            const data = await response.json();
            // console.log("Thisis the whole Hero Section data:", data);
            return data?.data?.sections[0];
        } catch (error) {
            console.error("Error fetching hero section:", error);
            throw Error("Failed to fetch hero section");
        }
    }
);


export const fetchGalleryOneSection = createAsyncThunk(
    "hero/fetchGalleryOneSection",
    async () => {
        try {
            const response = await fetch("http://localhost:9000/homepage-sections?section_type=woman");
            const data = await response.json();
            // console.log("This is the Woman Section data from the home Page Slice", data.data.sections[1]);
            return data.data.sections[1];
        } catch (error) {
            console.error("Error fetching woman section:", error);
            throw Error("Failed to fetch woman section");
        }
    }
);


// Add new fetch function for review section
export const fetchGallery_Two = createAsyncThunk(
    "hero/fetchGallery_Two",
    async () => {
        try {
            const response = await fetch("http://localhost:9000/homepage-sections?section_type=hero");
            const data = await response.json();
            return data.data.sections[2];
        } catch (error) {
            console.error("Error fetching review section:", error);
            throw Error("Failed to fetch review section");
        }
    }
);


// Add new fetch function for review section
export const fetchBestSeller_Section = createAsyncThunk(
    "hero/fetchBestSeller_Section",
    async () => {
        try {
            const response = await fetch("http://localhost:9000/homepage-sections?section_type=hero");
            const data = await response.json();
            return data.data.sections[3];
        } catch (error) {
            console.error("Error fetching review section:", error);
            throw Error("Failed to fetch review section");
        }
    }
);


// Add new fetch function for review section
export const fetchReviewSection = createAsyncThunk(
    "hero/fetchReviewSection",
    async () => {
        try {
            const response = await fetch("http://localhost:9000/homepage-sections?section_type=hero");
            const data = await response.json();
            // console.log("Review Section data:", data.data.sections[4]);
            return data.data.sections[4];
        } catch (error) {
            console.error("Error fetching review section:", error);
            throw Error("Failed to fetch review section");
        }
    }
);


const heroSlice = createSlice({
    name: "hero",
    initialState: {
        heroSection: null,
        galleryOneSection: null,
        galleryTwoSection: null, // Add new state property
        bestSellerSection: null, // Add new state property
        reviewSection: null, // Add new state property
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder


            // Existing hero section cases
            .addCase(fetchHeroSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHeroSection.fulfilled, (state, action) => {
                state.loading = false;
                state.heroSection = action.payload;
            })
            .addCase(fetchHeroSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch hero section";
            })


            // Add cases for Gallery One section
            .addCase(fetchGalleryOneSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGalleryOneSection.fulfilled, (state, action) => {
                state.loading = false;
                state.galleryOneSection = action.payload;
            })
            .addCase(fetchGalleryOneSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch woman section";
            })


            // Add cases for Gallery Two section
            .addCase(fetchGallery_Two.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGallery_Two.fulfilled, (state, action) => {
                state.loading = false;
                state.galleryTwoSection = action.payload;
            })
            .addCase(fetchGallery_Two.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch best Seller section";
            })
            

            // Add new cases for Best Seller section
            .addCase(fetchBestSeller_Section.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBestSeller_Section.fulfilled, (state, action) => {
                state.loading = false;
                state.bestSellerSection = action.payload;
            })
            .addCase(fetchBestSeller_Section.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch best Seller section";
            })


            // Add cases for Review section
            .addCase(fetchReviewSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewSection.fulfilled, (state, action) => {
                state.loading = false;
                state.reviewSection = action.payload;
            })
            .addCase(fetchReviewSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch review section";
            })



    },
});

export default heroSlice.reducer;