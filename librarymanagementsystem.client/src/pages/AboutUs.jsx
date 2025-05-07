import React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, Divider, Button, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Navbar from '../components/layout/Navbar';

const HeroSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    minHeight: '40vh',
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(8, 0),
}));

const StatCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    background: '#fff',
    borderRadius: '15px',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    background: '#0066cc',
    color: '#fff',
}));

const AboutUs = () => {
    const stats = [
        { number: '50K+', label: 'Books Available' },
        { number: '100+', label: 'Countries Reached' },
        { number: '1M+', label: 'Active Users' },
        { number: '24/7', label: 'Support' },
    ];

    const teamMembers = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Library Director',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
            bio: 'With over 15 years of experience in library management, Dr. Johnson leads our team with passion and expertise.'
        },
        {
            name: 'Michael Chen',
            role: 'Digital Resources Manager',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            bio: 'Michael oversees our digital transformation and ensures seamless access to our online resources.'
        },
        {
            name: 'Emma Rodriguez',
            role: 'Community Outreach Coordinator',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
            bio: 'Emma works tirelessly to connect our library with the community through various programs and events.'
        }
    ];

    const features = [
        {
            icon: <SchoolIcon sx={{ fontSize: 40 }} />,
            title: 'Educational Excellence',
            description: 'Providing high-quality educational resources for learners of all ages.'
        },
        {
            icon: <GroupsIcon sx={{ fontSize: 40 }} />,
            title: 'Community Focus',
            description: 'Building strong connections with our community through various programs.'
        },
        {
            icon: <AutoStoriesIcon sx={{ fontSize: 40 }} />,
            title: 'Digital Innovation',
            description: 'Embracing technology to make learning accessible to everyone.'
        },
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            title: 'Award-Winning Service',
            description: 'Recognized for excellence in library services and community engagement.'
        }
    ];

    return (
        <Box>
            <Navbar />
            <Toolbar />
            <Container maxWidth="lg" sx={{ py: 8 }}>
                {/* Hero Section */}
                <HeroSection>
                    <Container maxWidth="lg">
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    About Our Digital Library
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                                    Empowering minds through knowledge and innovation
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    sx={{ 
                                        bgcolor: '#fff',
                                        color: '#0066cc',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)'
                                        }
                                    }}
                                >
                                    Join Our Community
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box 
                                    component="img"
                                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da"
                                    alt="Digital Library"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </HeroSection>

                {/* Stats Section */}
                <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={4}>
                            {stats.map((stat, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <StatCard elevation={2}>
                                        <Typography variant="h3" sx={{ color: '#0066cc', fontWeight: 'bold' }}>
                                            {stat.number}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#666' }}>
                                            {stat.label}
                                        </Typography>
                                    </StatCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Mission & Vision */}
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={6}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" sx={{ color: '#0066cc', fontWeight: 'bold', mb: 3 }}>
                                    Our Mission
                                </Typography>
                                <Typography paragraph sx={{ fontSize: '1.1rem', color: '#666' }}>
                                    To provide free and open access to information, knowledge, and cultural resources, 
                                    fostering lifelong learning and community engagement. We believe in the power of 
                                    education to transform lives and communities.
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#0066cc', fontWeight: 'bold', mb: 3, mt: 4 }}>
                                    Our Vision
                                </Typography>
                                <Typography paragraph sx={{ fontSize: '1.1rem', color: '#666' }}>
                                    To be a leading digital library that connects people with knowledge, promotes 
                                    literacy, and serves as a hub for learning and cultural enrichment in the 
                                    digital age.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'grid', gap: 3 }}>
                                    {features.map((feature, index) => (
                                        <Paper 
                                            key={index}
                                            elevation={2}
                                            sx={{ 
                                                p: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3
                                            }}
                                        >
                                            <IconWrapper>
                                                {feature.icon}
                                            </IconWrapper>
                                            <Box>
                                                <Typography variant="h6" sx={{ color: '#333', mb: 1 }}>
                                                    {feature.title}
                                                </Typography>
                                                <Typography sx={{ color: '#666' }}>
                                                    {feature.description}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Team Section */}
                <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" align="center" sx={{ color: '#0066cc', fontWeight: 'bold', mb: 6 }}>
                            Meet Our Team
                        </Typography>
                        <Grid container spacing={4}>
                            {teamMembers.map((member, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Paper 
                                        elevation={2}
                                        sx={{ 
                                            p: 3,
                                            textAlign: 'center',
                                            borderRadius: '15px',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)'
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={member.image}
                                            alt={member.name}
                                            sx={{ 
                                                width: 150, 
                                                height: 150, 
                                                mx: 'auto',
                                                mb: 2,
                                                border: '3px solid #0066cc'
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ color: '#0066cc', mb: 1 }}>
                                            {member.name}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: '#666', mb: 2 }}>
                                            {member.role}
                                        </Typography>
                                        <Typography sx={{ color: '#666' }}>
                                            {member.bio}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Call to Action */}
                <Box sx={{ py: 8, bgcolor: '#0066cc', color: '#fff' }}>
                    <Container maxWidth="md">
                        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                            Join Our Growing Community
                        </Typography>
                        <Typography align="center" sx={{ mb: 4, opacity: 0.9 }}>
                            Be part of our mission to make knowledge accessible to everyone. 
                            Start your journey with us today.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button 
                                variant="contained" 
                                size="large"
                                sx={{ 
                                    bgcolor: '#fff',
                                    color: '#0066cc',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.9)'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="large"
                                sx={{ 
                                    borderColor: '#fff',
                                    color: '#fff',
                                    '&:hover': {
                                        borderColor: '#fff',
                                        bgcolor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Learn More
                            </Button>
                        </Box>
                    </Container>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs; 